import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
    test('homepage to events and back home', async ({ page }) => {
        await page.goto('/index.html');

        const mainNav = page.getByRole('navigation', { name: 'Primary' });
        await mainNav.getByRole('link', { name: 'Events' }).click();
        await expect(page).toHaveURL(/events\.html/);

        await mainNav.getByRole('link', { name: 'Home' }).click();
        await expect(page).toHaveURL(/index\.html|\/$/);
    });
});

test.describe('Event gallery', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/event.html?id=thai-ambassador-welcome-dinner');
    });

    test('opens gallery slideshow, navigates images, and closes it', async ({ page }) => {
        await test.step('open the slideshow', async () => {
            await page.getByRole('button', { name: 'View as slideshow' }).click();
            await expect(page.getByRole('button', { name: 'Close gallery' })).toBeVisible();
        });

        await test.step('navigate between images', async () => {
            await page.getByRole('button', { name: 'Next image' }).click();
            await page.getByRole('button', { name: 'Previous image' }).click();
        });

        await test.step('play and pause the slideshow', async () => {
            await page.getByRole('button', { name: 'Play slideshow' }).click();
            await page.getByRole('button', { name: 'Pause slideshow' }).click();
        });

        await test.step('close the gallery', async () => {
            const closeButton = page.getByRole('button', { name: 'Close gallery' });
            await closeButton.click();
            await expect(closeButton).not.toBeVisible();
        });
    });
});