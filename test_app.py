from playwright.sync_api import sync_playwright

def test_carknox_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 720})
        
        print("=" * 60)
        print("TESTING CARKNOX.AI WEB APPLICATION")
        print("=" * 60)
        
        # Navigate to app
        print("\n[1] Navigating to app...")
        page.goto('http://localhost:3005')
        page.wait_for_load_state('domcontentloaded')
        page.wait_for_timeout(2000)
        
        print(f"    Page title: {page.title()}")
        print(f"    URL: {page.url}")
        
        # Check page content
        content = page.content()
        
        if "CarKnox" in content or "Knox" in content:
            print("    [OK] App loaded successfully")
        else:
            print("    [FAIL] App content not found")
            
        # Take screenshot
        print("\n[2] Taking screenshot...")
        page.screenshot(path='carknox_hero.png', full_page=True)
        print("    Saved: carknox_hero.png")
        
        # Get visible text
        body = page.locator('body')
        text = body.text_content()[:200] if body.text_content() else "None"
        print(f"\n[3] Body text preview:")
        print(f"    {text[:80]}...")
        
        # Check for form elements
        print("\n[4] Form elements:")
        inputs = page.locator('input')
        print(f"    Input fields: {inputs.count()}")
        
        buttons = page.locator('button')
        print(f"    Buttons: {buttons.count()}")
        
        # Check sections
        print("\n[5] Sections:")
        print(f"    Sections found: {page.locator('section').count()}")
        
        # Report issues
        print("\n" + "=" * 60)
        print("ISSUES & IMPROVEMENTS:")
        print("=" * 60)
        
        issues = []
        
        # Check for viewport meta
        if 'viewport' not in content.lower():
            issues.append("Missing viewport meta tag")
        
        # Check for accessibility labels
        buttons_list = buttons.all()
        has_accessibility = False
        for btn in buttons_list[:3]:
            if btn.get_attribute('aria-label') or btn.get_attribute('role'):
                has_accessibility = True
                break
        if not has_accessibility:
            issues.append("Buttons missing accessibility labels")
            
        # Check for focus states
        if ':focus' not in content:
            issues.append("No visible focus states defined")
            
        # Check contrast (basic) - Tailwind
        bg_check = 'bg-' in content
        if not bg_check:
            issues.append("No Tailwind bg classes detected")
            
        if issues:
            for issue in issues:
                print(f"  - {issue}")
        else:
            print("  No major issues found")
        
        browser.close()
        
        print("\nDone!")

if __name__ == "__main__":
    test_carknox_app()