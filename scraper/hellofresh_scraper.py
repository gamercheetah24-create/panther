"""
HelloFresh + Factor Weekly Meal Scraper
---------------------------------------
Pulls ALL meals for the current week from HelloFresh and Factor,
with nutrition, ingredients, and allergens.

Run:  python hellofresh_scraper.py

Output:
    hellofresh_output/hellofresh_week_YYYY-MM-DD.txt
    factor_output/factor_week_YYYY-MM-DD.txt
"""

import json
import re
import sys
import time
from datetime import date, timedelta
from pathlib import Path

import requests

HF_OUT_DIR = Path("hellofresh_output")
FACTOR_OUT_DIR = Path("factor_output")
HF_MENUS_URL = "https://www.hellofresh.com/menus"
FACTOR_MENUS_URL = "https://www.factor75.com/weekly-menu"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/126.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate",
}


def fetch_page(session, url, label):
    """Fetch a public page and return raw HTML."""
    print(f"Fetching {label}...")
    for attempt in range(3):
        try:
            r = session.get(url, headers=HEADERS, timeout=30)
            if r.status_code == 200:
                return r.text
            print(f"  HTTP {r.status_code} (attempt {attempt + 1}/3)")
        except Exception as e:
            print(f"  Error: {e} (attempt {attempt + 1}/3)")
        time.sleep(2)
    return None


def extract_next_data(html):
    """Pull the largest embedded Next.js JSON blob from the HTML."""
    blocks = re.findall(
        r'<script[^>]*type="application/json"[^>]*>(.*?)</script>', html, re.S
    )
    for b in sorted(blocks, key=len, reverse=True):
        if len(b) < 50000:
            continue
        try:
            return json.loads(b)
        except json.JSONDecodeError:
            continue
    return None


def iso_week(d):
    iso = d.isocalendar()
    return f"{iso.year}-W{iso.week:02d}"


def factor_week_label(week):
    """Turn 2026-W38 into Factor's Sat-Fri delivery label, e.g. Sep 12-18."""
    try:
        year, wnum = week.split("-W")
        monday = date.fromisocalendar(int(year), int(wnum), 1)
    except (ValueError, TypeError):
        return week
    saturday = monday - timedelta(days=2)
    friday = saturday + timedelta(days=6)
    if saturday.month == friday.month:
        return f"{saturday.strftime('%b')} {saturday.day}-{friday.day}"
    return f"{saturday.strftime('%b')} {saturday.day}-{friday.strftime('%b')} {friday.day}"


def factor_auth_headers(token):
    return {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
    }


def pick_factor_public_week(session, token):
    """
    Factor's public weekly-menu shows the next 3 orderable weeks, not
    the current calendar week. Those are ISO weeks strictly after today.
    """
    try:
        r = session.get(
            "https://www.factor75.com/gw/menus-service/menus",
            headers=factor_auth_headers(token),
            params={
                "country": "FJ",
                "locale": "en-US",
                "product": "classic-box-unified",
                "take": 10,
            },
            timeout=30,
        )
        items = r.json().get("items") if r.status_code == 200 else []
    except Exception as e:
        print(f"  Could not list Factor weeks: {e}")
        items = []

    current = iso_week(date.today())
    future = sorted(
        {
            it.get("week")
            for it in (items or [])
            if it.get("week") and it.get("week") > current
        }
    )
    if future:
        return future[0]
    return iso_week(date.today() + timedelta(days=7))


def factor_recipe_search(session, token, week, extra_params=None):
    params = {
        "country": "FJ",
        "locale": "en-US",
        "limit": 250,
        "week": week,
    }
    if extra_params:
        params.update(extra_params)
    r = session.get(
        "https://gw.hellofresh.com/api/recipes/search",
        headers=factor_auth_headers(token),
        params=params,
        timeout=30,
    )
    r.raise_for_status()
    return r.json().get("items") or []


def nutrition_map(recipe):
    nutrition = {}
    for n in recipe.get("nutrition") or []:
        name = (n.get("name") or "").strip()
        amount = n.get("amount", "")
        unit = (n.get("unit") or "").strip()
        if name:
            nutrition[name] = f"{amount} {unit}".strip()
    return nutrition


def tag_names(recipe):
    tags = []
    for t in recipe.get("tags") or []:
        if t.get("displayLabel") is False:
            continue
        if t.get("name"):
            tags.append(t["name"])
    return sorted(set(tags))


def get_api_recipe(recipe_id, token, session, country="US"):
    """Fetch full recipe details (ingredients, allergens) from the API."""
    url = f"https://gw.hellofresh.com/api/recipes/{recipe_id}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
    }
    try:
        r = session.get(
            url,
            headers=headers,
            params={"country": country, "locale": "en-US"},
            timeout=15,
        )
        if r.status_code == 200:
            return r.json()
    except Exception:
        pass
    return None


def build_hf_meal(recipe_data, api_data=None, charge_setting=None):
    """Combine menu-page data and optional API data into a clean meal dict."""
    r = recipe_data

    surcharge = ""
    if charge_setting and charge_setting.get("amount"):
        cents = charge_setting["amount"]
        surcharge = f"${cents / 100:.2f}/serving"

    meal = {
        "meal": r.get("name", "Unknown"),
        "headline": r.get("headline", ""),
        "url": r.get("websiteUrl", ""),
        "category": r.get("category", {}).get("name", "") if isinstance(r.get("category"), dict) else "",
        "difficulty": r.get("difficulty", ""),
        "prep_time": "",
        "surcharge": surcharge,
        "tags": tag_names(r),
        "nutrition": nutrition_map(r),
        "ingredients": [],
        "allergens": [],
        "rating": r.get("averageRating", ""),
    }

    pt = r.get("prepTime") or r.get("totalTime") or ""
    m = re.search(r"(\d+)", pt)
    if m:
        meal["prep_time"] = f"{m.group(1)} min"

    if api_data:
        ing_names = {}
        for ing in api_data.get("ingredients") or []:
            ing_names[ing["id"]] = ing.get("name", "")

        yields = api_data.get("yields") or []
        if yields:
            for yi in yields[0].get("ingredients", []):
                iid = yi.get("id", "")
                name = ing_names.get(iid, "")
                amount = yi.get("amount", "")
                unit = yi.get("unit", "")
                if name:
                    amt_str = ""
                    if amount:
                        amt_str = f"{amount} {unit}".strip()
                    if amt_str:
                        meal["ingredients"].append(f"{name} ({amt_str})")
                    else:
                        meal["ingredients"].append(name)
        elif api_data.get("ingredients"):
            meal["ingredients"] = [
                ing.get("name", "")
                for ing in api_data["ingredients"]
                if ing.get("name")
            ]

        meal["allergens"] = [
            a.get("name", "")
            for a in api_data.get("allergens") or []
            if a.get("name")
        ]

    return meal


def extract_ingredient_statement(description):
    """Pull the FDA-style ingredient paragraph from a Factor description."""
    if not description:
        return ""
    m = re.search(r"Ingredients:\s*(.*)", description, re.S | re.I)
    stmt = m.group(1).strip() if m else description.strip()
    stmt = re.split(r"\nThe nutrition facts", stmt, maxsplit=1)[0].strip()
    stmt = re.sub(r"\s+", " ", stmt)
    return stmt


def public_factor_url(url):
    if not url:
        return ""
    return url.replace("https://fj.factor75.com", "https://www.factor75.com")


def build_factor_meal(recipe):
    """Turn a Factor weekly-menu recipe into a clean meal dict."""
    category = ""
    if isinstance(recipe.get("category"), dict):
        category = recipe["category"].get("name", "") or ""

    serving = recipe.get("servingSize")
    serving_size = f"{serving} g" if serving else ""

    ingredients = [
        ing.get("name", "")
        for ing in recipe.get("ingredients") or []
        if ing.get("name")
    ]

    return {
        "meal": recipe.get("name", "Unknown"),
        "headline": recipe.get("headline", "") or "",
        "url": public_factor_url(recipe.get("websiteUrl", "")),
        "category": category,
        "meal_type": "Add-on" if recipe.get("isAddon") else "Meal",
        "prep_time": "Ready in 2 min",
        "serving_size": serving_size,
        "surcharge": "",
        "tags": tag_names(recipe),
        "nutrition": nutrition_map(recipe),
        "ingredients": ingredients,
        "ingredient_statement": extract_ingredient_statement(
            recipe.get("description") or ""
        ),
        "allergens": [
            a.get("name", "")
            for a in recipe.get("allergens") or []
            if a.get("name")
        ],
        "rating": recipe.get("averageRating", ""),
    }


def write_txt(meals, path, title, extra_header=""):
    """Write the AI-friendly .txt file."""
    with open(path, "w", encoding="utf-8") as f:
        f.write(f"{title}\n")
        f.write(f"Scraped: {date.today().isoformat()}\n")
        if extra_header:
            f.write(f"{extra_header}\n")
        f.write(f"Meals: {len(meals)}\n")
        f.write("=" * 70 + "\n\n")

        for i, m in enumerate(meals, 1):
            f.write(f"{i}. {m['meal']}\n")
            if m.get("headline"):
                f.write(f"   {m['headline']}\n")
            f.write(f"   URL: {m.get('url', '')}\n")
            if m.get("meal_type"):
                f.write(f"   Type: {m['meal_type']}\n")
            if m.get("prep_time"):
                f.write(f"   Prep: {m['prep_time']}\n")
            if m.get("serving_size"):
                f.write(f"   Serving size: {m['serving_size']}\n")
            if m.get("category"):
                f.write(f"   Category: {m['category']}\n")
            if m.get("surcharge"):
                f.write(f"   EXTRA CHARGE: {m['surcharge']}\n")
            if m.get("tags"):
                f.write(f"   Tags: {', '.join(m['tags'])}\n")
            if m.get("allergens"):
                f.write(f"   Allergens: {', '.join(m['allergens'])}\n")
            else:
                f.write("   Allergens: none listed\n")

            f.write("   NUTRITION:\n")
            if m.get("nutrition"):
                for k, v in m["nutrition"].items():
                    f.write(f"     {k}: {v}\n")
            else:
                f.write("     (not listed)\n")

            if m.get("ingredient_statement"):
                f.write("   INGREDIENT LIST:\n")
                f.write(f"     {m['ingredient_statement']}\n")

            f.write("   INGREDIENTS:\n")
            if m.get("ingredients"):
                for x in m["ingredients"]:
                    f.write(f"     - {x}\n")
            else:
                f.write("     (visit URL for ingredients)\n")
            f.write("\n")


def scrape_hellofresh():
    """Scrape the current HelloFresh weekly menu. Returns a result dict."""
    session = requests.Session()
    print()
    print("HelloFresh")
    print("-" * 40)

    html = fetch_page(session, HF_MENUS_URL, "hellofresh.com/menus")
    if not html:
        return {"ok": False, "error": "Could not fetch hellofresh.com/menus"}

    HF_OUT_DIR.mkdir(exist_ok=True)
    (HF_OUT_DIR / "menus_page.html").write_bytes(
        html.encode("utf-8", errors="replace")
    )

    data = extract_next_data(html)
    ssr = (data or {}).get("props", {}).get("pageProps", {}).get("ssrPayload", {})
    courses = ssr.get("courses") or []
    if not courses:
        return {
            "ok": False,
            "error": "Could not find HelloFresh meal data in page.",
        }

    print(f"Found {len(courses)} meals on the menu.\n")

    token = ssr.get("serverAuth", {}).get("access_token", "")
    if token:
        print("Got API token for full ingredient data.")
    else:
        print("No API token found -- will get nutrition only (no ingredients).")
    print()

    meals = []
    for n, course in enumerate(courses, 1):
        recipe = course.get("recipe", {})
        name = recipe.get("name", "?")
        print(f"  [{n}/{len(courses)}] {name}")

        api_data = None
        if token and recipe.get("id"):
            api_data = get_api_recipe(recipe["id"], token, session, country="US")
            if not api_data:
                print("    (API fetch failed, using menu data only)")
            time.sleep(0.3)

        meals.append(build_hf_meal(recipe, api_data, course.get("chargeSetting")))

    return {"ok": True, "meals": meals, "source": "HelloFresh weekly menu"}


def scrape_factor():
    """Scrape Factor's public weekly menu (the week shown on factor75.com)."""
    session = requests.Session()
    print()
    print("Factor")
    print("-" * 40)

    html = fetch_page(session, FACTOR_MENUS_URL, "factor75.com/weekly-menu")
    if not html:
        return {"ok": False, "error": "Could not fetch factor75.com/weekly-menu"}

    data = extract_next_data(html)
    ssr = (data or {}).get("props", {}).get("pageProps", {}).get("ssrPayload", {})
    token = (ssr.get("serverAuth") or {}).get("access_token", "")
    if not token:
        return {"ok": False, "error": "Could not find Factor API token in page."}

    print("Got API token for Factor weekly menu.")

    week = pick_factor_public_week(session, token)
    label = factor_week_label(week)
    print(f"Public menu week: {week} ({label})")
    print("(This is the week Factor shows on the site, not the calendar week.)")

    try:
        meals_raw = factor_recipe_search(
            session, token, week, {"product": "classic-box"}
        )
        all_raw = factor_recipe_search(session, token, week)
    except Exception as e:
        return {"ok": False, "error": f"Factor menu search failed: {e}"}

    if not meals_raw:
        return {"ok": False, "error": f"No Factor meals found for {week}."}

    meal_ids = {r.get("id") for r in meals_raw}
    addons_raw = [r for r in all_raw if r.get("id") not in meal_ids]

    print(f"Found {len(meals_raw)} ready-made meals + {len(addons_raw)} add-ons.\n")

    meals = []
    for recipe in meals_raw:
        meal = build_factor_meal(recipe)
        meal["meal_type"] = "Meal"
        meals.append(meal)
    for recipe in addons_raw:
        meal = build_factor_meal(recipe)
        meal["meal_type"] = "Add-on"
        meals.append(meal)
    return {
        "ok": True,
        "meals": meals,
        "source": "Factor weekly menu",
        "week": f"{week} ({label})",
    }


def save_brand(result, out_dir, json_name, txt_prefix, title):
    """Write JSON + TXT for one brand. Returns the txt path or None."""
    if not result.get("ok"):
        print(f"ERROR: {result.get('error', 'unknown error')}")
        return None

    out_dir.mkdir(exist_ok=True)
    today = date.today().isoformat()
    meals = result["meals"]
    extra = f"Week: {result['week']}" if result.get("week") else ""

    json_out = {
        "source": result.get("source", title),
        "scraped_on": today,
        "week": result.get("week", ""),
        "meal_count": len(meals),
        "meals": meals,
    }
    json_path = out_dir / json_name
    json_path.write_text(
        json.dumps(json_out, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    txt_path = out_dir / f"{txt_prefix}_{today}.txt"
    write_txt(meals, txt_path, title, extra_header=extra)
    print(f"  {txt_path}   ({len(meals)} meals)")
    print(f"  {json_path}")
    return txt_path


def main():
    print()
    print("HelloFresh + Factor Weekly Meal Scraper")
    print("=" * 40)
    print("No browser. No login. Both menus in one run.")
    print()

    hf_result = scrape_hellofresh()
    factor_result = scrape_factor()

    print()
    print("Saving files")
    print("-" * 40)

    hf_txt = save_brand(
        hf_result,
        HF_OUT_DIR,
        "hellofresh_week.json",
        "hellofresh_week",
        "HELLOFRESH WEEKLY MEAL DATABASE",
    )
    factor_txt = save_brand(
        factor_result,
        FACTOR_OUT_DIR,
        "factor_week.json",
        "factor_week",
        "FACTOR WEEKLY MEAL DATABASE",
    )

    print()
    if hf_txt and factor_txt:
        print("DONE -- both menus scraped.")
        print(f"  HelloFresh: {hf_txt.resolve()}")
        print(f"  Factor:     {factor_txt.resolve()}")
        print()
        return

    if hf_txt or factor_txt:
        print("PARTIAL -- one menu failed.")
        if hf_txt:
            print(f"  HelloFresh OK: {hf_txt.resolve()}")
        if factor_txt:
            print(f"  Factor OK:     {factor_txt.resolve()}")
        print()
        sys.exit(1)

    print("ERROR: Neither HelloFresh nor Factor could be scraped.")
    sys.exit(1)


if __name__ == "__main__":
    main()
