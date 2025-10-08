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

    # Select the Road element
    page.click("#btn-ROAD")

    # Place a road in the center of the canvas
    page.click("#gameCanvas", position={"x": 300, "y": 200})

    # Give a moment for the 3D scene to render
    page.wait_for_timeout(1000)

    # Take a screenshot for visual verification
    page.screenshot(path="jules-scratch/verification/verification_road_only.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        run_verification(page)
        browser.close()

if __name__ == "__main__":
    main()