import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Application } from '@hotwired/stimulus';
import ModalWindow from '../src/index';

vi.mock('@dpsys/js-utils/el', () =>
({
    elCreate: (tag, attrs = {}) =>
    {
        const element = document.createElement(tag);
        if (attrs.class)
        {
            element.className = attrs.class;
        }
        return element;
    }
}));

vi.mock('@dpsys/js-utils/misc', () =>
({
    pause: (ms) => new Promise((resolve) => setTimeout(resolve, ms))
}));

describe('ModalWindow Stimulus Controller', () =>
{
    let application;

    beforeEach(() =>
    {
        vi.useFakeTimers();
        document.body.innerHTML = '';
        application = Application.start();
        application.register('modal-window', ModalWindow);
    });

    afterEach(() =>
    {
        application.stop();
        vi.clearAllTimers();
        vi.restoreAllMocks();
        document.body.innerHTML = '';
    });

    it('creates .modal_window_content and wraps initial children on connect', async () =>
    {
        document.body.innerHTML = `
            <div data-controller="modal-window">
                <span id="child-element">Modal Body Text</span>
            </div>
        `;

        await vi.runAllTimersAsync();

        const modal = document.querySelector('[data-controller="modal-window"]');
        const content = modal.querySelector('.modal_window_content');
        const child = content.querySelector('#child-element');

        expect(modal.classList.contains('modal_window')).toBe(true);
        expect(content).not.toBeNull();
        expect(child).not.toBeNull();
    });

    it('opens modal when opener element is clicked', async () =>
    {
        document.body.innerHTML = `
            <button id="open-btn" class="open-modal-trigger">Open</button>
            <div data-controller="modal-window"
                 data-modal-window-opener-value=".open-modal-trigger"
                 data-modal-window-open-duration-ms-value="200">
                <div class="modal_window_content">Content</div>
            </div>
        `;

        await vi.runAllTimersAsync();

        const opener = document.getElementById('open-btn');
        const modal = document.querySelector('[data-controller="modal-window"]');

        opener.click();

        expect(modal.classList.contains('opening')).toBe(true);
        expect(modal.style.visibility).toBe('visible');

        vi.advanceTimersByTime(200);
        await vi.runAllTimersAsync();

        expect(modal.classList.contains('opened')).toBe(true);
        expect(modal.classList.contains('opening')).toBe(false);
    });

    it('closes modal when closer button is clicked', async () =>
    {
        document.body.innerHTML = `
            <button id="open-btn" class="open-modal-trigger">Open</button>
            <div data-controller="modal-window"
                 data-modal-window-opener-value=".open-modal-trigger"
                 data-modal-window-open-duration-ms-value="0"
                 data-modal-window-close-duration-ms-value="150">
                <div class="modal_window_closer">X</div>
                <div class="modal_window_content">Content</div>
            </div>
        `;

        await vi.runAllTimersAsync();

        const opener = document.getElementById('open-btn');
        const closer = document.querySelector('.modal_window_closer');
        const modal = document.querySelector('[data-controller="modal-window"]');

        opener.click();
        await vi.runAllTimersAsync();
        expect(modal.classList.contains('opened')).toBe(true);

        closer.click();
        expect(modal.classList.contains('closing')).toBe(true);

        vi.advanceTimersByTime(150);
        await vi.runAllTimersAsync();

        expect(modal.classList.contains('closed')).toBe(true);
        expect(modal.classList.contains('opened')).toBe(false);
        expect(modal.style.visibility).toBe('');
    });

    it('closes when clicking outside the opened modal', async () =>
    {
        document.body.innerHTML = `
            <div id="outside-area">Outside</div>
            <button id="open-btn" class="open-modal-trigger">Open</button>
            <div data-controller="modal-window"
                 data-modal-window-opener-value=".open-modal-trigger"
                 data-modal-window-open-duration-ms-value="0"
                 data-modal-window-close-duration-ms-value="0">
                <div class="modal_window_content">Content</div>
            </div>
        `;

        await vi.runAllTimersAsync();

        const opener = document.getElementById('open-btn');
        const outside = document.getElementById('outside-area');
        const modal = document.querySelector('[data-controller="modal-window"]');

        opener.click();
        await vi.runAllTimersAsync();
        expect(modal.classList.contains('opened')).toBe(true);

        outside.click();
        await vi.runAllTimersAsync();

        expect(modal.classList.contains('closed')).toBe(true);
        expect(modal.classList.contains('opened')).toBe(false);
    });

    it('ignores outside click if matching clickOutsideIgnoreValue selector', async () =>
    {
        document.body.innerHTML = `
            <div id="ignored-area" class="ignore-me">Ignored Click Target</div>
            <button id="open-btn" class="open-modal-trigger">Open</button>
            <div data-controller="modal-window"
                 data-modal-window-opener-value=".open-modal-trigger"
                 data-modal-window-click-outside-ignore-value='[".ignore-me"]'
                 data-modal-window-open-duration-ms-value="0"
                 data-modal-window-close-duration-ms-value="0">
                <div class="modal_window_content">Content</div>
            </div>
        `;

        await vi.runAllTimersAsync();

        const opener = document.getElementById('open-btn');
        const ignored = document.getElementById('ignored-area');
        const modal = document.querySelector('[data-controller="modal-window"]');

        opener.click();
        await vi.runAllTimersAsync();
        expect(modal.classList.contains('opened')).toBe(true);

        ignored.click();
        await vi.runAllTimersAsync();

        expect(modal.classList.contains('opened')).toBe(true);
        expect(modal.classList.contains('closed')).toBe(false);
    });

    it('removes document event listeners on disconnect', async () =>
    {
        document.body.innerHTML = `
            <button id="open-btn" class="open-modal-trigger">Open</button>
            <div id="modal"
                 data-controller="modal-window"
                 data-modal-window-opener-value=".open-modal-trigger"
                 data-modal-window-open-duration-ms-value="0">
                <div class="modal_window_content">Content</div>
            </div>
        `;

        await vi.runAllTimersAsync();

        const modal = document.getElementById('modal');
        const opener = document.getElementById('open-btn');

        // Remove element from DOM to trigger disconnect
        modal.remove();
        await vi.runAllTimersAsync();

        // Click opener after disconnect
        opener.click();
        await vi.runAllTimersAsync();

        expect(modal.classList.contains('opened')).toBe(false);
        expect(modal.classList.contains('opening')).toBe(false);
    });
});