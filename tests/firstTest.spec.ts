import { test, expect } from "@playwright/test";

//akan menjalankan before each terlebih dahulu
test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();
});

test("Locator syntac rules", async ({ page }) => {
  //by tag name
  await page.locator("input").first().click();

  //by ID
  page.locator("#inputEmail1");

  //by class
  page.locator(".shape-rectangle");

  //by attribute
  page.locator('[placeholder="Email"]');

  //by class (full)
  page.locator(
    "[input-full-width size-medium status-basic shape-rectangle nb-transition]"
  );

  //combine different selector
  page.locator('input[placeholder="Email"].shape-rectangle');
  page.locator('input[placeholder="Email"][nbinput]');

  //by xpath (Tidak direkomendasikan karena jika web berubah maka akan dirubah juga xpath nya, jadi lebih baik gunakan locator yang visible)
  page.locator('//*[@id="inputEmail1"]');

  //by partial text match (rekomendasi)
  page.locator(':text("Using)');

  //by exact text match (rekomendasi)
  page.locator(':text-is("Using the Grid")');
});

//akan mencari locators yang terlihat di UI (as a user)
test("User facing locators", async ({ page }) => {
  //get by role akan mengambil jeni dari locator
  await page.getByRole("textbox", { name: "Email" }).first().click();
  await page.getByRole("button", { name: "Sign in" }).first().click();

  //jika menggunakan label & place holder maka akan otomatis klik ke bagian inputan dari label tersebut
  await page.getByLabel("Email").first().click();
  await page.getByPlaceholder("Email").first().click();
  await page.getByText("Submit").first().click();
  await page.getByTitle("IoT Dashboard").click();
  await page.getByTestId("SignIn").click();
});

//child element
test("locating child element", async ({ page }) => {
  //cara 1
  await page.locator('nb-card nb-radio :text-is("Option 1")').click();

  //cara 2
  await page
    .locator("nb-card")
    .locator("nb-radio")
    .locator(':text-is("Option 2")')
    .click();

  //cara 3
  await page
    .locator("nb-card")
    .getByRole("button", { name: "Sign In" })
    .first()
    .click();

  //cara 4
  await page.locator("nb-card").nth(4).getByRole("button").click();
});

test("locating parent element", async ({ page }) => {
  await page
    .locator("nb-card", { hasText: "Using the Grid" })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator("nb-card", { has: page.locator("#inputEmail1") })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator("nb-card")
    .filter({ hasText: "Basic form" })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator("nb-card")
    .filter({ has: page.locator(".status-danger") })
    .getByRole("textbox", { name: "Password" })
    .click();

  await page
    .locator("nb-card")
    .filter({ has: page.locator("nb-checkbox") })
    .filter({ hasText: "Sign in" })
    .getByRole("textbox", { name: "Email" })
    .click();

  //locator("..") => digunakan untuk menemukan parent element yang ada diatasnya
  await page
    .locator(':text-is("Using the Grid")')
    .locator("..")
    .getByRole("textbox", { name: "Email" })
    .click();
});

test("Reusing the selector", async ({ page }) => {
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
  const email = basicForm.getByRole("textbox", { name: "Email" });
  const password = basicForm.getByRole("textbox", { name: "Password" });

  await email.fill("tes123@gmail.com");
  await password.fill("123");
  await basicForm.locator("nb-checkbox").click();
  await basicForm.getByRole("button").click();

  await expect(email).toHaveValue("tes123@gmail.com");
});

test("extracting values", async ({ page }) => {
  //single text value
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
  const buttonText = await basicForm.locator("button").textContent(); //akan mengambil text di dalam button
  expect(buttonText).toEqual("Submit"); //lalu membandingkan dengan yang di expect

  //all text values
  const allRadioButtonLabels = await page.locator("nb-radio").allTextContents(); //akan mengambil seluruh text di dalam array
  expect(allRadioButtonLabels).toContain("Option 1"); //lalu membandingkan dengan apakah ada Option 1 di dalam array

  //input text
  const emailField = basicForm.getByRole("textbox", { name: "Email" });
  await emailField.fill("test123@gmail.com");
  const emailValue = await emailField.inputValue();
  expect(emailValue).toEqual("test123@gmail.com");

  const placeHolderValue = await emailField.getAttribute("placeholder");
  expect(placeHolderValue).toEqual("Email");
});

test("assertion", async ({ page }) => {
  const basicForm = page
    .locator("nb-card")
    .filter({ hasText: "Basic form" })
    .locator("button");

  //general assertion
  const value = 5;
  expect(value).toEqual(5);

  const text = await basicForm.textContent();
  expect(text).toEqual("Submit");

  //locator assertion
  await expect(basicForm).toHaveText("Submit");

  //soft assertion
  await expect(basicForm).toHaveText("submit");
  await basicForm.click();
});
