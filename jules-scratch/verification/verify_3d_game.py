import os
from playwright.sync_api import sync_playwright, Page, expect

def run_verification(page: Page):
    # Get the absolute path to the HTML file
    absolute_path = os.path.abspath("Golden_Ratio_Game.html")

    # Navigate to the local HTML file
    page.goto(f"file://{absolute_path}")

    # Wait for the canvas to be visible
    canvas = page.locator("#gameCanvas")
    expect(canvas).to_be_visible()

    # Place a building (default selection)
    page.click("#gameCanvas", position={"x": 200, "y": 150})

    # Select the Park element
    page.click("#btn-PARK")

    # Place a park
    page.click("#gameCanvas", position={"x": 400, "y": 250})

    # Select the Road element
    page.click("#btn-ROAD")

    # Place a road
    page.click("#gameCanvas", position={"x": 300, "y": 50})

    # Give a moment for the 3D scene to render before taking a screenshot
    page.wait_for_timeout(1000)

    # Take a screenshot for visual verification
    page.screenshot(path="jules-scratch/verification/verification.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        run_verification(page)
        browser.close()

if __name__ == "__main__":
    main()