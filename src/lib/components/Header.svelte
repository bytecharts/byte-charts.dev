<script>
	import { onMount } from 'svelte';
	import { darkTheme } from '$lib/stores/theme.js';
	let theme = $state('bc-light');

	function applyTheme(newTheme) {
		theme = newTheme;
		darkTheme.set(theme === 'bc-dark');

		document.documentElement.setAttribute('data-theme', theme);

		localStorage.setItem('theme', theme);
	}

	onMount(() => {
		// Close dropdowns
		const closeDetails = (e) => {
			document.querySelectorAll('details[open]').forEach((details) => {
				if (!details.contains(e.target)) {
					details.removeAttribute('open');
				}
			});
		};

		document.addEventListener('click', closeDetails);

		const savedTheme = localStorage.getItem('theme');
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

		applyTheme(savedTheme ?? (prefersDark ? 'bc-dark' : 'bc-light'));

		return () => {
			document.removeEventListener('click', closeDetails);
		};
	});
</script>

<div class="navbar-container sticky top-0 z-100">
	<!--Right Side -->
	<div class=" navbar bg-base-100">
		<div class="navbar-start">
			<!--Mobile Menu-->
			<div class="dropdown">
				<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h8m-8 6h16"
						/>
					</svg>
				</div>

				<ul
					tabindex="0"
					class="dropdown-content menu z-[1] mt-3 w-52 menu-sm rounded-box bg-white p-2 shadow"
				>
					<li><a class="brand-link hvr-lines-square tracking-normal" href="/">Home</a></li>
					<li>
						<a class="brand-link hvr-lines-square tracking-normal" href="/gallery">Gallery</a>
					</li>
					<li><a class="brand-link hvr-lines-square tracking-normal" href="/blog">Blog</a></li>
					<li><a class="brand-link hvr-lines-square tracking-normal" href="/about">About</a></li>

					<!--Theme Toggler-->
					<li class="m-auto">
						<label class="flex cursor-pointer gap-2">
							<!-- sun -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
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
							<input type="checkbox" value="bc-light" class="theme-controller toggle" />

							<!-- moon -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
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
					</li>
				</ul>
			</div>
			<a href="/" class="brand-logo btn-ghost">
				<img src="/images/byte-charts.svg" alt="Byte Charts Logo" class="logo-img" />
			</a>

			<span
				class="header-font text-1xl font-black tracking-wide uppercase
				md:text-3xl">Byte Charts</span
			>
		</div>

		<!--Left Side-->
		<div class="navbar-end hidden lg:flex">
			<ul class="menu menu-horizontal relative z-10 px-1">
				<li><a class="brand-link hvr-lines-square tracking-normal" href="/"> Home </a></li>
				<li>
					<a class="brand-link hvr-lines-square tracking-normal" href="/gallery"> Gallery </a>
				</li>
				<li><a class="brand-link hvr-lines-square tracking-normal" href="/blog"> Blog </a></li>
				<li><a class="brand-link hvr-lines-square tracking-normal" href="/about">About</a></li>

				<!-- Theme Toggler -->
				<li class="m-auto">
					<label class="flex cursor-pointer gap-2">
						<!-- sun -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
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
							checked={theme === 'bc-dark'}
							onchange={(e) => applyTheme(e.currentTarget.checked ? 'bc-dark' : 'bc-light')}
						/>

						<!-- moon -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
						</svg>
					</label>
				</li>
			</ul>
		</div>
	</div>
</div>

<style>
	.brand-link {
		font-family: 'Space Grotesk', sans;
		font-size: 1.575rem;
		font-weight: 700;
	}
	.brand-logo {
		height: 64px;
		width: 64px;
	}
</style>
