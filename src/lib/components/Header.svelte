<script>
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { darkTheme } from '$lib/stores/theme.js';
	let theme = $state('bc-light');
	let current = $derived(page.url.pathname);

	const isActive = (path) =>
		path === '/' ? current === '/' : current === path || current.startsWith(`${path}/`);

	function applyTheme(newTheme) {
		theme = newTheme;
		darkTheme.set(theme === 'bc-dark');

		document.documentElement.setAttribute('data-theme', theme);

		localStorage.setItem('theme', theme);
	}

	// Mobile menu open state drives the hamburger animation and menu visibility.
	let menuOpen = $state(false);
	let dropdownEl;

	// Blur the link after navigation clicks and close the mobile menu.
	function closeMenu(event) {
		menuOpen = false;
		const target = event.currentTarget;
		if (target instanceof HTMLElement) target.blur();
	}

	onMount(() => {
		const savedTheme = localStorage.getItem('theme');
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

		applyTheme(savedTheme ?? (prefersDark ? 'bc-dark' : 'bc-light'));

		const onDocumentClick = (event) => {
			if (menuOpen && dropdownEl && !dropdownEl.contains(event.target)) menuOpen = false;
		};
		const onKeyDown = (event) => {
			if (event.key === 'Escape') menuOpen = false;
		};
		document.addEventListener('click', onDocumentClick);
		document.addEventListener('keydown', onKeyDown);

		return () => {
			document.removeEventListener('click', onDocumentClick);
			document.removeEventListener('keydown', onKeyDown);
		};
	});
</script>

{#snippet themeToggle()}
	<label class="flex cursor-pointer items-center gap-2">
		<!-- sun -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<circle cx="12" cy="12" r="5" />
			<path
				d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
			/>
		</svg>
		<input
			type="checkbox"
			class="toggle"
			aria-label="Toggle dark mode"
			checked={theme === 'bc-dark'}
			onchange={(e) => applyTheme(e.currentTarget.checked ? 'bc-dark' : 'bc-light')}
		/>

		<!-- moon -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
		</svg>
	</label>
{/snippet}

<div class="navbar-container sticky top-0 z-100">
	<!--Right Side -->
	<div class=" navbar bg-base-100">
		<div class="navbar-start">
			<a href={resolve('/')} class="brand-logo btn-ghost">
				<img src="/images/byte-charts.svg" alt="Byte Charts Logo" class="logo-img" />
			</a>
		</div>

		<!--Right Side-->
		<div class="navbar-end">
			<ul class="menu menu-horizontal relative z-10 hidden flex-nowrap px-1 xl:flex">
				<li>
					<a class="brand-link tracking-normal" href={resolve('/')}>
						<span class="hvr-lines-square p-2" class:current-tab={isActive('/')}>Home</span>
					</a>
				</li>
				<li>
					<a class="brand-link tracking-normal" href={resolve('/gallery')}>
						<span class="hvr-lines-square p-2" class:current-tab={isActive('/gallery')}
							>Gallery</span
						>
					</a>
				</li>
				<li>
					<a class="brand-link tracking-normal" href={resolve('/blog')}>
						<span class="hvr-lines-square p-2" class:current-tab={isActive('/blog')}>Blog</span>
					</a>
				</li>
				<li>
					<a class="brand-link tracking-normal" href={resolve('/about')}
						><span class="hvr-lines-square p-2" class:current-tab={isActive('/about')}>About</span
						></a
					>
				</li>
				<li>
					<a class="brand-link tracking-normal" href={resolve('/contact')}
						><span class="hvr-lines-square p-2" class:current-tab={isActive('/contact')}
							>Contact</span
						></a
					>
				</li>
			</ul>

			<!-- Medium screens (768–1280): top three links inline, rest in the drawer -->
			<ul class="menu menu-horizontal relative z-10 hidden flex-nowrap px-1 md:flex xl:hidden">
				<li>
					<a class="brand-link tracking-normal" href={resolve('/')}>
						<span class="hvr-lines-square p-2" class:current-tab={isActive('/')}>Home</span>
					</a>
				</li>
				<li>
					<a class="brand-link tracking-normal" href={resolve('/gallery')}>
						<span class="hvr-lines-square p-2" class:current-tab={isActive('/gallery')}
							>Gallery</span
						>
					</a>
				</li>
				<li>
					<a class="brand-link tracking-normal" href={resolve('/about')}
						><span class="hvr-lines-square p-2" class:current-tab={isActive('/about')}>About</span
						></a
					>
				</li>
			</ul>

			<!-- Theme toggle lives in the navbar, never inside a menu. -->
			<div class="ml-2 flex items-center">
				{@render themeToggle()}
			</div>

			<!--Mobile Menu-->
			<div bind:this={dropdownEl} class="relative xl:hidden">
				<button
					type="button"
					aria-label={menuOpen ? 'Close menu' : 'Open menu'}
					aria-haspopup="true"
					aria-expanded={menuOpen}
					onclick={() => (menuOpen = !menuOpen)}
					class="btn btn-ghost"
				>
					<span class="menu-lines" class:menu-open={menuOpen} aria-hidden="true">
						<span></span>
						<span></span>
						<span></span>
					</span>
				</button>

				{#if menuOpen}
					<ul
						transition:fade={{ duration: 150 }}
						class="menu absolute right-0 z-[1] mt-3 w-52 menu-sm rounded-box bg-white p-2 shadow"
					>
						<li class="md:hidden">
							<a class="brand-link tracking-normal" href={resolve('/')} onclick={closeMenu}
								><span class="hvr-lines-square p-2" class:current-tab={isActive('/')}>Home</span></a
							>
						</li>
						<li class="md:hidden">
							<a class="brand-link tracking-normal" href={resolve('/gallery')} onclick={closeMenu}
								><span class="hvr-lines-square p-2" class:current-tab={isActive('/gallery')}
									>Gallery</span
								></a
							>
						</li>
						<li>
							<a class="brand-link tracking-normal" href={resolve('/blog')} onclick={closeMenu}
								><span class="hvr-lines-square p-2" class:current-tab={isActive('/blog')}>Blog</span
								></a
							>
						</li>
						<li class="md:hidden">
							<a class="brand-link tracking-normal" href={resolve('/about')} onclick={closeMenu}
								><span class="hvr-lines-square p-2" class:current-tab={isActive('/about')}
									>About</span
								></a
							>
						</li>
						<li>
							<a class="brand-link tracking-normal" href={resolve('/contact')} onclick={closeMenu}
								><span class="hvr-lines-square p-2" class:current-tab={isActive('/contact')}
									>Contact</span
								></a
							>
						</li>
					</ul>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.brand-link {
		font-family: 'Space Grotesk', sans;
		font-size: 1.575rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		background-color: transparent;
		background-image: none;
	}

	/* Current-tab underline lives in layout.css (shared with filter buttons). */
	/* Nav links press down like buttons on hover/focus; the current tab rests there. */
	.brand-link .hvr-lines-square {
		transition: transform 0.2s ease-out;
	}
	.brand-link:is(:hover, :focus-visible, :active) .hvr-lines-square,
	.hvr-lines-square.current-tab {
		transform: translateY(10%);
	}
	/* Current tab also gets a darker backdrop behind the text width. */
	.hvr-lines-square.current-tab {
		background-color: #f4f4f4;
	}
	@media (prefers-reduced-motion: reduce) {
		.brand-link .hvr-lines-square {
			transition: none;
		}
	}
	.brand-logo {
		height: 64px;
		width: 64px;
	}

	/* Animated hamburger: three lines morph into an X when open. */
	.menu-lines {
		display: flex;
		flex-direction: column;
		gap: 5px;
		width: 20px;
	}
	.menu-lines > span {
		display: block;
		height: 2px;
		width: 100%;
		border-radius: 2px;
		background-color: currentColor;
		transition:
			transform 0.3s ease,
			opacity 0.2s ease;
	}
	.menu-lines.menu-open > span:nth-child(1) {
		transform: translateY(7px) rotate(45deg);
	}
	.menu-lines.menu-open > span:nth-child(2) {
		opacity: 0;
	}
	.menu-lines.menu-open > span:nth-child(3) {
		transform: translateY(-7px) rotate(-45deg);
	}
	@media (prefers-reduced-motion: reduce) {
		.menu-lines > span {
			transition: none;
		}
	}
</style>
