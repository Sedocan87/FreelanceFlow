from playwright.sync_api import Page, expect

def test_styling_fix(page: Page):
    """
    This test verifies that the styling is correctly applied to the login page.
    """
    # 1. Arrange: Go to the login page.
    page.goto("http://localhost:5173/login")

    # 2. Assert: Check for the presence of a styled element.
    # We'll check for the main card element, which should have a specific background color.
    # In shadcn, the card component has a `card` class.
    card = page.locator(".card")
    expect(card).to_be_visible()

    # 3. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="/app/freelanceflow-frontend/jules-scratch/verification/verification.png")
    print("Screenshot taken.")
