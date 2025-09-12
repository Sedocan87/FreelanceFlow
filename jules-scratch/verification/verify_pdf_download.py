from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Navigate to the app
        page.goto("http://localhost:5173")

        # Go to invoices page
        page.get_by_role("link", name="Invoices").click()
        expect(page).to_have_url("http://localhost:5173/invoices")

        # Wait for the table to be visible
        invoice_table = page.get_by_role("table")
        expect(invoice_table).to_be_visible()

        # Find the first invoice row
        first_row = invoice_table.get_by_role("row").nth(1) # nth(0) is the header
        expect(first_row).to_be_visible()

        # Click the actions button
        actions_button = first_row.get_by_role("button")
        actions_button.click()

        # Expect the dropdown to appear
        dropdown = page.get_by_role("menu")
        expect(dropdown).to_be_visible()

        # Start waiting for the download
        with page.expect_download() as download_info:
            # Click the "Download PDF" link
            download_link = dropdown.get_by_text("Download PDF")
            download_link.click()

        download = download_info.value
        # Wait for the download to complete
        path = download.path()
        print(f"Download started: {download.suggested_filename}")
        print(f"Download path: {path}")

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
