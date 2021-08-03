<template>
	<div>
		<div
			id="conspon-dynamic-nav"
			v-cloak
		>
			<div
				id="conspon-dynamic-nav-inner"
				data-metrics-module="header"
			>
				<span
					class="toggle"
					@click="toggleNav"
				></span>
				<template
					v-for="(navItem, navNum) in navLinks"
				>
					<a
						v-if="!navItem.subnav && navItem.link"
						:href="navItem.link"
						class="nav-btn"
						:key="navItem.text"
					>
						<div
							class="image"
							v-if="navItem.image"
						>
							<img
								:src="navItem.image"
							/>
						</div>
						<p v-if="navItem.text">
							{{ navItem.text }}
						</p>
					</a>
					<div
						v-else
						class="nav-btn"
						:key="navItem.text"
					>
						<div
							class="image"
							v-if="navItem.image"
						>
							<img
								:src="navItem.image"
							/>
						</div>
						<p v-if="navItem.text">
							{{ navItem.text }}
						</p>
						<div
							class="subnav hide"
							v-if="navItem.subnav"
						>
							<a
								v-for="(subnavItem, linkNum) in navItem.subnav"
								:href="subnavItem.link"
								:key="subnavItem.text"
								:data-metrics-link="'nav' + (navNum + 1) + '-link' + (linkNum + 1)"
							>
								<p>{{ subnavItem.text }}</p>
							</a>
						</div>
					</div>
				</template>
			</div>
		</div>
		<div id="conspon-dynamic-nav-spacer"></div>
		<div
			id="conspon-dynamic-nav-toggle"
			@click="toggleNav"
		></div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			navLinks: [],
			navConfig: {},
			metricsCount: 0,
			moduleContent: '',
		};
	},
	components: {
	},
	props: {
		// STORE: Gets the ID of the module that is passed by PageBuilder
		chronicId: {
			type: String,
			required: true,
		},
	},
	computed: {
		// STORE: The call to the store, passing the ID of the module for the component
		getModuleByChronicId() {
			return this.$store.getters['cms/modules'](this.chronicId);
		},

		/*
		 * STORE:
		 * Returns the contents of the HTML module. Here I'm parsing it as a JSON object.
		 * See "created()" for where this all comes together
		 */
		getModuleContent() {
			const moduleData = this.getModuleByChronicId;

			try {
				return JSON.parse(moduleData.module_data.contentText);
			} catch (error) {
				return null;
			}
		},
	},
	created() {
		// STORE: Get the module content
		this.moduleContent = this.getModuleContent;

		// If navLinks is present in the module data, use it
		if (this.moduleContent.navLinks) {
			this.navLinks = this.moduleContent.navLinks;
		}

		// If navConfig is present in the module data, use it
		if (this.moduleContent.navConfig) {
			this.navConfig = this.moduleContent.navConfig;
		}
	},
	mounted() {
		this.handleNavConfig();
		this.wireSubnavEvents();
		this.wireNavbtnMetrics();
	},
	methods: {
		toggleSubnav: function toggleSubnav(event) {
			const subnav = event.target.querySelector('.subnav');

			if (subnav) {
				if (event.type === 'mouseenter') {
					// Toggle the element
					subnav.classList.remove('hide');
				} else {
					// Toggle the element
					subnav.classList.add('hide');
				}
			}
		},

		wireSubnavEvents: function wireSubnavEvents() {
			const subnavs = document.querySelectorAll('.subnav');

			subnavs.forEach((item) => {
				item.parentNode.addEventListener('mouseenter', this.toggleSubnav);
				item.parentNode.addEventListener('mouseleave', this.toggleSubnav);
			});
		},

		toggleNav: function toggleNav() {
			const outerConsponNav = document.getElementById('conspon-dynamic-nav');
			outerConsponNav.classList.toggle('open');
		},

		wireNavbtnMetrics: function wireNavBtnMetrics() {
			const navBtns = document.querySelectorAll('a.nav-btn');

			navBtns.forEach((itemProp) => {
				const item = itemProp;
				this.metricsCount += 1;
				item.dataset.metricsLink = this.metricsCount;
			});
		},

		handleNavConfig: function handleNavConfig() {
			if (this.navConfig != null) {
				// Add style overrides element
				const styleOverrides = document.head.appendChild(document.createElement('style'));

				if (this.navConfig.topPosition) {
					styleOverrides.innerHTML += `#conspon-dynamic-nav {top: ${this.navConfig.topPosition};}
						@media all and (max-width: 980px) {#conspon-dynamic-nav-toggle {top: ${this.navConfig.topPosition};}}`;
				}

				// Set to sticky if config calls for it
				if (this.navConfig.sticky) {
					styleOverrides.innerHTML += '#conspon-dynamic-nav {position: fixed !important;}';
				}
			}
		},
	},
};
</script>

<style lang="scss">
@import "https://fonts.googleapis.com/css2?family=Lato&display=swap";

@font-face {
	font-family: icons;
	src: url("https://css.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/fonts/icons.woff");
}

#conspon-dynamic-nav {
	width: 100%;
	display: block;
	position: absolute;
	user-select: none;
	z-index: 100;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-webkit-tap-highlight-color: transparent;

	&[v-cloak] {
		visibility: none;
	}

	#conspon-dynamic-nav-inner {
		background-color: #ededed;
		display: flex;
		font-family: Lato, sans-serif;
		font-size: 18px;
		height: 50px;
		justify-content: center;
		width: 100%;

		a {
			text-decoration: none;
			color: #000;
		}

		.nav-btn {
			align-items: center;
			background-color: #d7d7d7;
			color: #000;
			cursor: pointer;
			display: flex;
			height: 100%;
			margin-left: 15px;
			padding-left: 15px;
			position: relative;

			&:hover {
				text-decoration: underline;
				background-color: #b9d0d9;
			}

			&:active {
				text-decoration: underline;
				background-color: #b9d0d9;
			}

			> .image {
				height: inherit;
				margin-bottom: auto;
				margin-right: 15px;
				margin-top: auto;

				img {
					flex-shrink: 0; // IE fix for stretched images
					height: 100%;
					max-width: 100%; // IE fix for stretched images
				}
			}

			> p {
				margin-right: 15px;
				margin-top: auto;
				margin-bottom: auto;
			}

			&:nth-child(2) {
				margin: 0;
			}

			.subnav {
				background-color: #f1efef;
				border-radius: 10px;
				box-shadow: 3px 3px 5px 0 #0000002e;
				color: black;
				left: 50%;
				min-width: 100px;
				position: absolute;
				top: 70px;
				transform: translateX(-50%);
				white-space: nowrap;
				width: fit-content;
				z-index: 1;

				&::before {
					background-color: #f1efef;
					content: "";
					height: 25px;
					left: 50%;
					position: absolute;
					top: 2px;
					transform: rotate(45deg) translateX(-75%);
					width: 25px;
					z-index: -1;
				}

				&::after {
					content: "";
					height: 50px;
					left: 50%;
					position: absolute;
					top: -35px;
					transform: translateX(-50%);
					width: 100%;
					z-index: -1;
				}

				p {
					margin: 0;
					padding: 10px 16px;

					&:hover {
						background-color: #dcdcdc;
					}

					&:active {
						background-color: #dcdcdc;
					}
				}

				a {
					&:first-of-type {
						p {
							border-radius: 10px 10px 0 0;
						}
					}

					&:last-of-type {
						p {
							border-radius: 0 0 10px 10px;
						}
					}

					&:only-child {
						p {
							border-radius: 10px;
						}
					}
				}
			}
		}
	}

	.hide {
		visibility: hidden;
	}
}

#conspon-dynamic-nav-spacer {
	position: relative;
	height: 50px;
	display: block;
	z-index: -1;
}

#conspon-dynamic-nav-toggle {
	display: none;
}

body {
	margin: 0;
}

@media all and (max-width: 980px) {
	#conspon-dynamic-nav {
		height: 100vh;
		left: -200px;
		position: fixed;
		transition: left 0.5s;
		width: 200px;
		z-index: 2;

		#conspon-dynamic-nav-inner {
			background-color: #a7a7a7;
			display: inline-block;
			height: 100vh;

			.toggle {
				display: inline-block;
				height: 69px;
				position: relative;
				width: 79px;

				&::after {
					color: #fff;
					content: "\e909";
					cursor: pointer;
					font-family: icons; // stylelint-disable-line
					font-size: 25px !important;
					padding: 20px 25px 15px;
					position: absolute;
				}
			}

			.nav-btn {
				height: 50px;
				margin: 10px 0 !important;

				.subnav {
					left: calc(100% + 25px);
					top: 0;
					-webkit-transform: none;
					transform: none;

					&::before {
						left: 2px;
						top: 27px;
					}

					&::after {
						height: 100%;
						left: -15px;
						top: 0;
						width: 50px;
					}
				}
			}
		}

		&.open {
			left: 0 !important;
		}
	}

	#conspon-dynamic-nav-spacer {
		display: none;
	}

	#conspon-dynamic-nav-toggle {
		display: inline;
		height: 69px;
		position: absolute;
		width: 79px;
		z-index: 1;

		&::after {
			content: "\e902";
			cursor: pointer;
			font-family: icons; // stylelint-disable-line
			font-size: 31px;
			padding: 15px 25px;
			position: absolute;
		}
	}
}
</style>
