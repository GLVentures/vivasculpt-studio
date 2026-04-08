/* VivaSculpt Studio PWA (static demo)
   - Tabs + workout timer player
   - Trial/paywall demo via localStorage (NOT real payments)
   - No dangerous HTML injection from user input
*/

const SUPPORT_EMAIL = "hello@vivasculptstudioapp.com";

const STORAGE_KEY = "vivasculpt_demo_state_v1";
const TRIAL_DAYS = 7;

const $ = (sel) => document.querySelector(sel);

function nowMs() {
	return Date.now();
}
function daysBetween(aMs, bMs) {
	return Math.max(0, Math.ceil((bMs - aMs) / (24 * 60 * 60 * 1000)));
}

function loadState() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return {};
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === "object" ? parsed : {};
	} catch {
		return {};
	}
}
function saveState(next) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function escapeText(s) {
	// Minimal escaping for any displayed user-provided content.
	// We will also prefer textContent and avoid innerHTML for user content.
	return String(s)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

function validateEmail(email) {
	// Reasonable email validation for client-side
	return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).trim());
}

// ---------- Workouts ----------
const MOVESETS = {
	defaultA: [
		{
			name: "Squat",
			low: "Bodyweight squat to a chair, slow and controlled.",
			classic: "Squat + optional small hop at the top.",
		},
		{
			name: "Incline push-up",
			low: "Hands on couch/table, slow tempo.",
			classic: "Faster reps or move to the floor.",
		},
		{
			name: "Reverse lunge",
			low: "Shallow range, hold onto a wall if needed.",
			classic: "Add knee drive on the way up.",
		},
		{
			name: "Mountain climbers",
			low: "Slow climbers, focus on core.",
			classic: "Fast climbers.",
		},
		{
			name: "Plank",
			low: "Knees down plank.",
			classic: "Full plank hold.",
		},
	],
	low1: [
		{ name: "Step jacks", low: "Step side-to-side, arms up.", classic: "Jumping jacks." },
		{ name: "Squat to chair", low: "Tap chair lightly.", classic: "Squat + hop." },
		{ name: "Slow climbers", low: "Slow controlled.", classic: "Fast climbers." },
		{ name: "Glute bridge", low: "Regular tempo.", classic: "Single-leg alternating." },
		{ name: "Dead bug", low: "Slow controlled.", classic: "Faster alternating (controlled)." },
	],
	classic1: [
		{ name: "High knees", low: "Marching knees.", classic: "Fast high knees." },
		{ name: "Skaters", low: "Side step + reach.", classic: "Skater hops." },
		{ name: "Push-ups", low: "Incline push-ups.", classic: "Floor push-ups." },
		{ name: "Burpee (optional)", low: "Walk-out to plank.", classic: "Full burpee." },
		{ name: "Plank jacks", low: "Step feet out/in.", classic: "Jump feet out/in." },
	],
};

function getWorkoutById(id) {
	if (id === "defaultA") return MOVESETS.defaultA;
	if (id === "low1") return MOVESETS.low1;
	if (id === "classic1") return MOVESETS.classic1;
	return MOVESETS.defaultA;
}

// ---------- Audio beep ----------
function beep() {
	// Simple beep using Web Audio API
	try {
		const ctx = new (window.AudioContext || window.webkitAudioContext)();
		const o = ctx.createOscillator();
		const g = ctx.createGain();
		o.type = "sine";
		o.frequency.value = 880;
		o.connect(g);
		g.connect(ctx.destination);
		g.gain.setValueAtTime(0.001, ctx.currentTime);
		g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.01);
		o.start();
		g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
		o.stop(ctx.currentTime + 0.13);
		setTimeout(() => ctx.close(), 250);
	} catch {
		// ignore
	}
}

// ---------- Timer player ----------
let player = {
	isOpen: false,
	isPaused: false,
	intervalId: null,
	workSec: 40,
	restSec: 20,
	audioOn: true,
	intensity: "low", // "low" | "classic"
	rounds: 2,
	lengthMin: 20,
	workoutId: "defaultA",
	moves: [],
	moveIndex: 0,
	roundIndex: 1,
	phase: "work", // "work" | "rest"
	secLeft: 40,
};

function resetPlayer(config) {
	player = {
		...player,
		isOpen: true,
		isPaused: false,
		intervalId: null,
		workSec: 40,
		restSec: 20,
		audioOn: config.audioOn ?? true,
		intensity: config.intensity,
		rounds: config.rounds,
		lengthMin: config.lengthMin,
		workoutId: config.workoutId,
		moves: getWorkoutById(config.workoutId),
		moveIndex: 0,
		roundIndex: 1,
		phase: "work",
		secLeft: 40,
	};
}

function startTick() {
	stopTick();
	player.intervalId = setInterval(() => {
		if (player.isPaused) return;
		player.secLeft -= 1;

		if (player.secLeft <= 0) {
			if (player.audioOn) beep();

			if (player.phase === "work") {
				player.phase = "rest";
				player.secLeft = player.restSec;
			} else {
				// rest -> next move
				player.phase = "work";
				player.secLeft = player.workSec;
				advanceMove();
			}
		}
		renderPlayer();
	}, 1000);
}
function stopTick() {
	if (player.intervalId) clearInterval(player.intervalId);
	player.intervalId = null;
}

function advanceMove() {
	player.moveIndex += 1;
	if (player.moveIndex >= player.moves.length) {
		player.moveIndex = 0;
		player.roundIndex += 1;
	}
	if (player.roundIndex > player.rounds) {
		endWorkout();
	}
}

function endWorkout() {
	stopTick();
	closeModal("workoutModal");
	player.isOpen = false;
}

// ---------- Trial / Paywall demo ----------
function isTrialActive(state) {
	if (!state.trialStartMs || !state.trialEndMs) return false;
	return nowMs() < state.trialEndMs;
}
function isTrialExpired(state) {
	if (!state.trialStartMs || !state.trialEndMs) return false;
	return nowMs() >= state.trialEndMs;
}
function daysLeft(state) {
	if (!state.trialEndMs) return 0;
	return daysBetween(nowMs(), state.trialEndMs);
}

function setTrial(state, email) {
	const start = nowMs();
	const end = start + TRIAL_DAYS * 24 * 60 * 60 * 1000;
	const next = {
		...state,
		plan: "trial_starter",
		trialStartMs: start,
		trialEndMs: end,
		// Don't store email if you don't want to; we keep it optional.
		// If you store it, it's only local to this device.
		email: email ? String(email).trim() : undefined,
	};
	saveState(next);
	return next;
}

// ---------- Rendering ----------
function tabIcon(name) {
	// Inline SVG, simple and consistent
	const common = `fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
	switch (name) {
		case "today":
			return `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${common} d="M7 7h10M7 12h10M7 17h6"/><path ${common} d="M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>`;
		case "workouts":
			return `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${common} d="M4 10v4M20 10v4"/><path ${common} d="M7 9v6M17 9v6"/><path ${common} d="M7 12h10"/></svg>`;
		case "meals":
			return `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${common} d="M4 3v7a4 4 0 0 0 4 4v7"/><path ${common} d="M8 3v7"/><path ${common} d="M14 3v18"/><path ${common} d="M20 3v6a3 3 0 0 1-3 3h-1"/></svg>`;
		case "kickstart":
			return `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${common} d="M12 2l3 7h7l-5.5 4.2L18.5 21 12 16.9 5.5 21l2-7.8L2 9h7z"/></svg>`;
		case "pricing":
			return `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${common} d="M12 1v22"/><path ${common} d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"/></svg>`;
		default:
			return "";
	}
}

function renderApp() {
	const state = loadState();
	const trialOn = isTrialActive(state);
	const trialOver = isTrialExpired(state);

	const app = $("#app");
	app.innerHTML = `
		<div class="vs-shell">
			<div class="vs-top">
				<header class="vs-header">
					<div class="vs-brand">
						<div class="vs-logo">VivaSculpt</div>
						<div class="vs-tagline">15–25 minute home HIIT + protein-forward meals (optional gentle fasting)</div>
					</div>
					<div class="vs-badges">
						<span class="badge em">Emerald Edition</span>
						<span class="badge">Support: <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></span>
					</div>
				</header>

				<div class="vs-banner ${trialOn ? "is-on" : ""}" id="trialBanner" role="status" aria-live="polite">
					<div class="vs-banner-inner">
						<div>
							<strong>Trial active</strong>
							<span class="small"> — ${daysLeft(state)} day(s) left. Subscription required after trial.</span>
						</div>
						<button class="btn small ghost" id="openPricingFromBanner">View plans</button>
					</div>
				</div>
			</div>

			<main class="vs-main">
				<section class="screen is-active" id="screen-today" aria-label="Today">
					<div class="grid cols2">
						<div class="card">
							<div class="h1">Today’s Session</div>
							<p class="p">Pick your time, intensity, and level. Every workout includes Low‑Impact and Classic options.</p>
							<div class="hr"></div>

							<div class="row">
								<div>
									<label class="small" for="lengthSel">Workout length</label>
									<select id="lengthSel">
										<option value="15">15 min</option>
										<option value="20" selected>20 min</option>
										<option value="25">25 min</option>
									</select>
								</div>

								<div>
									<label class="small">Intensity</label>
									<div class="toggle" role="tablist" aria-label="Intensity toggle">
										<button class="intBtn is-on" data-int="low" type="button">Low‑Impact</button>
										<button class="intBtn" data-int="classic" type="button">Classic</button>
									</div>
								</div>

								<div>
									<label class="small" for="levelSel">Level</label>
									<select id="levelSel">
										<option value="2">Beginner (2 rounds)</option>
										<option value="3">Intermediate (3 rounds)</option>
									</select>
								</div>
							</div>

							<div class="row" style="margin-top:12px">
								<button class="btn primary" id="startWorkoutBtn" type="button">Start workout</button>
								<button class="btn ghost" id="openHowBtn" type="button">How it works</button>
							</div>

							<div class="hr"></div>
							<div class="note">
								<div class="h2">Safety note</div>
								<p class="p">This is general fitness content, not medical advice. Modify as needed and consult a professional if you have medical concerns.</p>
							</div>
						</div>

						<div class="card">
							<div class="h1">Today’s Moves (Demo)</div>
							<ul class="list" id="todayMovesList"></ul>
							<div class="hr"></div>
							<p class="p">Tip: choose Low‑Impact to stay quiet and joint‑friendly, or Classic for higher intensity.</p>
						</div>
					</div>
				</section>

				<section class="screen" id="screen-workouts" aria-label="Workouts">
					<div class="grid cols2">
						<div class="card">
							<div class="h1">Low‑Impact HIIT</div>
							<p class="p">Quiet, apartment‑friendly, knee‑friendly options.</p>
							<div class="hr"></div>

							<div class="accordion" id="accLow"></div>

							<div class="hr"></div>
							<div class="note">
								<div class="h2">Warm-up & cooldown</div>
								<ul class="list">
									<li>Warm-up: march/step touch, arm circles, hip hinges, squats to comfort.</li>
									<li>Cooldown: slow walk, deep breathing, gentle stretches.</li>
								</ul>
							</div>
						</div>

						<div class="card">
							<div class="h1">Classic HIIT</div>
							<p class="p">Higher intensity, higher sweat. Use modifications whenever needed.</p>
							<div class="hr"></div>

							<div class="accordion" id="accClassic"></div>

							<div class="hr"></div>
							<div class="note">
								<div class="h2">Form first</div>
								<p class="p">Quality reps > speed. If form breaks, slow down or switch to Low‑Impact.</p>
							</div>
						</div>
					</div>
				</section>

				<section class="screen" id="screen-meals" aria-label="Meals">
					<div class="grid cols2">
						<div class="card">
							<div class="h1">Protein-forward meals + healthy fats</div>
							<p class="p">Simple templates you can repeat. Add fiber and hydration daily.</p>
							<div class="hr"></div>
							<ul class="list">
								<li><strong>Greek yogurt bowl</strong>: yogurt + berries + nuts</li>
								<li><strong>Eggs + veg</strong>: eggs + sautéed veg + olive oil</li>
								<li><strong>Chicken/tofu salad</strong>: protein + veggies + olive oil</li>
								<li><strong>Salmon/tofu plate</strong>: roasted veg + avocado</li>
							</ul>

							<div class="row" style="margin-top:12px">
								<button class="btn primary" id="genGroceryBtn" type="button">Generate grocery list</button>
							</div>
							<div id="groceryBox" style="margin-top:12px; display:none"></div>
						</div>

						<div class="card">
							<div class="h1">Optional gentle fasting (intro)</div>
							<p class="p">Time‑restricted eating can help structure your day. It’s optional and should feel easy.</p>
							<div class="hr"></div>
							<ul class="list">
								<li>Week 1: <strong>12:12</strong></li>
								<li>Week 2: <strong>14:10</strong> if energy/sleep are good</li>
								<li>Week 3+: <strong>16:8</strong> only if it remains easy</li>
							</ul>
							<div class="hr"></div>
							<div class="note">
								<div class="h2">Safety note</div>
								<p class="p">Avoid or pause fasting if it causes dizziness or a restrict/binge cycle, or if you have medical needs that require a different approach.</p>
							</div>
						</div>
					</div>
				</section>

				<section class="screen" id="screen-kickstart" aria-label="Kickstart">
					<div class="card">
						<div class="h1">7‑Day VivaSculpt Kickstart</div>
						<p class="p">A simple first week: 3 workouts + recovery days + meal templates.</p>
						<div class="hr"></div>
						<ul class="list">
							<li>Day 1: HIIT A (Full body)</li>
							<li>Day 2: Recovery + steps</li>
							<li>Day 3: HIIT B (Lower body + core)</li>
							<li>Day 4: Recovery + reset</li>
							<li>Day 5: HIIT C (Upper body + finisher)</li>
							<li>Day 6: Optional 15‑min burner</li>
							<li>Day 7: Recovery + check‑in</li>
						</ul>
						<div class="hr"></div>
						<div class="row">
							<a class="btn primary" href="#" id="kickstartPdfBtn">Download the 7‑Day Kickstart (PDF)</a>
							<button class="btn ghost" id="openKickstartNote" type="button">How to use</button>
						</div>
						<p class="p" style="margin-top:10px">
							<!-- Replace the # link above with your real PDF URL when you have it -->
							When you have a PDF, replace the link target in <code>index.html</code>.
						</p>
					</div>
				</section>

				<section class="screen" id="screen-pricing" aria-label="Pricing">
					<div class="grid cols2">
						<div class="card">
							<div class="h1">Trial + subscription</div>
							<div class="note">
								<p class="p"><strong>7‑day Starter trial</strong>, then subscription required to continue. Pro has no trial.</p>
								<p class="p">This is a static demo (no payment processing yet). For help: <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></p>
							</div>

							<div class="hr"></div>

							<div class="grid">
								<div class="card" style="box-shadow:none">
									<div class="h2">Starter — $14/month</div>
									<ul class="list">
										<li>15–25 min programs</li>
										<li>Low‑Impact + Classic options</li>
										<li>Today workout + schedule</li>
										<li>Meal templates + grocery list</li>
									</ul>
									<div class="row" style="margin-top:10px">
										<button class="btn primary" id="startTrialBtn" type="button">Start 7‑day trial (Starter)</button>
									</div>
								</div>

								<div class="card" style="box-shadow:none">
									<div class="h2">Pro — $29/month</div>
									<ul class="list">
										<li>Everything in Starter</li>
										<li>Personalized plan adjustments (coming soon)</li>
										<li>Meal plan generator (coming soon)</li>
										<li>Advanced insights (coming soon)</li>
									</ul>
									<div class="row" style="margin-top:10px">
										<button class="btn ghost" id="goProBtn" type="button">Choose Pro (no trial)</button>
									</div>
								</div>
							</div>

							<div class="hr"></div>
							<div class="footer">
								<div class="links">
									<a href="#" data-policy="tos">Terms of Service</a>
									<a href="#" data-policy="privacy">Privacy Policy</a>
									<a href="#" data-policy="regional">Regional Terms (EU/UK/US)</a>
									<a href="mailto:${SUPPORT_EMAIL}">Contact</a>
								</div>
								<div>© ${new Date().getFullYear()} VivaSculpt Studio</div>
							</div>
						</div>

						<div class="card">
							<div class="h1">Why people stick with VivaSculpt</div>
							<ul class="list">
								<li><strong>Time-boxed</strong>: 15–25 minutes feels doable.</li>
								<li><strong>Two intensity modes</strong>: Low‑Impact or Classic every day.</li>
								<li><strong>Protein-forward meals</strong>: simple templates + healthy fats.</li>
								<li><strong>Consistency</strong> beats perfection.</li>
							</ul>

							<div class="hr"></div>
							<div class="lock ${trialOver ? "" : "hidden"}" id="trialEndedBox" style="display:${trialOver ? "block" : "none"}">
								<strong>Trial ended.</strong>
								<div class="p">Subscription required to continue (demo UI).</div>
								<div class="row" style="margin-top:10px">
									<button class="btn primary" id="subscribeStarterBtn" type="button">Subscribe Starter $14/mo</button>
									<button class="btn ghost" id="subscribeProBtn" type="button">Subscribe Pro $29/mo</button>
								</div>
							</div>

							<div class="hr"></div>
							<div class="note">
								<div class="h2">Security & data (demo)</div>
								<p class="p">This demo doesn’t collect passwords or payment details. Trial state is stored only in your browser using localStorage.</p>
							</div>
						</div>
					</div>
				</section>
			</main>

			<nav class="tabs" aria-label="Bottom navigation">
				<button class="tab is-active" data-go="today" type="button">${tabIcon("today")}<span>Today</span></button>
				<button class="tab" data-go="workouts" type="button">${tabIcon("workouts")}<span>Workouts</span></button>
				<button class="tab" data-go="meals" type="button">${tabIcon("meals")}<span>Meals</span></button>
				<button class="tab" data-go="kickstart" type="button">${tabIcon("kickstart")}<span>Kickstart</span></button>
				<button class="tab" data-go="pricing" type="button">${tabIcon("pricing")}<span>Pricing</span></button>
			</nav>

			<div class="modal-backdrop" id="backdrop" aria-hidden="true"></div>

			<!-- Workout Modal -->
			<div class="modal" id="workoutModal" role="dialog" aria-modal="true" aria-label="Workout player">
				<div class="modal-card">
					<div class="modal-head">
						<div>
							<p class="modal-title">Workout Player</p>
							<p class="p" id="playerSub" style="margin:6px 0 0"></p>
						</div>
						<button class="modal-close" data-close="workoutModal" type="button">Close</button>
					</div>

					<div class="hr"></div>

					<div class="grid cols2">
						<div class="card" style="box-shadow:none">
							<div class="h1" id="playerMove">Move</div>
							<p class="p" id="playerMode"></p>
							<div class="hr"></div>
							<div class="row">
								<span class="badge em" id="playerPhase">WORK</span>
								<span class="badge" id="playerRound">Round 1/2</span>
								<span class="badge" id="playerNext">Next: —</span>
							</div>
							<div class="hr"></div>
							<div class="h1" style="font-size:46px; margin:0" id="playerTime">40</div>
							<p class="p" id="playerHint"></p>

							<div class="row" style="margin-top:12px">
								<button class="btn primary" id="pauseBtn" type="button">Pause</button>
								<button class="btn ghost" id="nextBtn" type="button">Next</button>
								<button class="btn danger" id="endBtn" type="button">End</button>
							</div>

							<div class="hr"></div>
							<div class="row">
								<label class="small" style="margin:0">Audio cues</label>
								<div class="toggle" aria-label="Audio cues toggle">
									<button class="audBtn is-on" data-aud="on" type="button">On</button>
									<button class="audBtn" data-aud="off" type="button">Off</button>
								</div>
							</div>
						</div>

						<div class="card" style="box-shadow:none">
							<div class="h2">Low‑Impact vs Classic</div>
							<p class="p">Use the option that keeps form strong.</p>
							<div class="hr"></div>
							<div class="note">
								<div class="h2" style="margin:0 0 6px">Low‑Impact</div>
								<p class="p" id="moveLow"></p>
							</div>
							<div style="height:10px"></div>
							<div class="note">
								<div class="h2" style="margin:0 0 6px">Classic</div>
								<p class="p" id="moveClassic"></p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Generic Modal -->
			<div class="modal" id="genericModal" role="dialog" aria-modal="true" aria-label="Info">
				<div class="modal-card">
					<div class="modal-head">
						<p class="modal-title" id="genTitle">Info</p>
						<button class="modal-close" data-close="genericModal" type="button">Close</button>
					</div>
					<div class="hr"></div>
					<div id="genBody"></div>
				</div>
			</div>

			<!-- Trial Modal -->
			<div class="modal" id="trialModal" role="dialog" aria-modal="true" aria-label="Start trial">
				<div class="modal-card">
					<div class="modal-head">
						<p class="modal-title">Start 7‑day Starter trial</p>
						<button class="modal-close" data-close="trialModal" type="button">Close</button>
					</div>
					<div class="hr"></div>

					<div class="note">
						<p class="p"><strong>This is a static demo.</strong> No payment is processed yet. Trial state is stored on your device only.</p>
					</div>

					<div class="hr"></div>

					<label class="small" for="trialEmail">Email (required)</label>
					<input id="trialEmail" type="email" placeholder="you@example.com" autocomplete="email" />

					<div class="row" style="margin-top:12px">
						<button class="btn primary" id="confirmTrialBtn" type="button">Activate trial</button>
						<button class="btn ghost" data-close="trialModal" type="button">Cancel</button>
					</div>

					<p class="p" style="margin-top:10px">
						Need help? Contact <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.
					</p>
				</div>
			</div>

			<!-- Lock Modal -->
			<div class="modal" id="lockModal" role="dialog" aria-modal="true" aria-label="Trial ended lock">
				<div class="modal-card">
					<div class="modal-head">
						<p class="modal-title">Trial ended — subscription required</p>
					</div>
					<div class="hr"></div>
					<div class="lock">
						<strong>Access is locked (demo)</strong>
						<p class="p">Your 7‑day Starter trial has ended. Choose a plan to continue.</p>
					</div>
					<div class="row" style="margin-top:12px">
						<button class="btn primary" id="lockStarterBtn" type="button">Subscribe Starter $14/mo</button>
						<button class="btn ghost" id="lockProBtn" type="button">Subscribe Pro $29/mo</button>
					</div>
					<p class="p" style="margin-top:10px">
						This demo doesn’t process payments. Join the waitlist / ask support: <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>
					</p>
				</div>
			</div>

		</div>
	`;

	// Fill Today moves list (demo)
	const ul = $("#todayMovesList");
	ul.innerHTML = ""; // safe: content controlled
	for (const m of MOVESETS.defaultA) {
		const li = document.createElement("li");
		li.textContent = `${m.name} — Low: ${m.low} | Classic: ${m.classic}`;
		ul.appendChild(li);
	}

	// Accordions
	renderAccordion("accLow", [
		{ title: "Low‑Impact Burner (15 min)", id: "low1" },
		{ title: "Quiet Sweat (20 min)", id: "low1" },
		{ title: "No‑Jump Full Body (25 min)", id: "low1" },
		{ title: "Core + Glutes (15 min)", id: "low1" },
		{ title: "Apartment Cardio (20 min)", id: "low1" },
		{ title: "Low‑Impact Sculpt (25 min)", id: "low1" },
	], "low");

	renderAccordion("accClassic", [
		{ title: "Classic HIIT A (15 min)", id: "classic1" },
		{ title: "Classic HIIT B (20 min)", id: "classic1" },
		{ title: "Classic HIIT C (25 min)", id: "classic1" },
		{ title: "Sweat Sprint (15 min)", id: "classic1" },
		{ title: "Power + Cardio (20 min)", id: "classic1" },
		{ title: "Full Sweat Session (25 min)", id: "classic1" },
	], "classic");

	// Tabs
	document.querySelectorAll(".tab").forEach((btn) => {
		btn.addEventListener("click", () => goto(btn.dataset.go));
	});

	// Banner button
	$("#openPricingFromBanner")?.addEventListener("click", () => goto("pricing"));

	// Intensity toggle
	let selectedIntensity = "low";
	document.querySelectorAll(".intBtn").forEach((b) => {
		b.addEventListener("click", () => {
			selectedIntensity = b.dataset.int;
			document.querySelectorAll(".intBtn").forEach((x) => x.classList.toggle("is-on", x === b));
		});
	});

	// Start workout
	$("#startWorkoutBtn")?.addEventListener("click", () => {
		if (trialOver) {
			openLock();
			return;
		}
		const lengthMin = Number($("#lengthSel").value);
		const rounds = Number($("#levelSel").value);
		resetPlayer({
			intensity: selectedIntensity,
			rounds,
			lengthMin,
			workoutId: "defaultA",
			audioOn: true,
		});
		openWorkout();
	});

	// How it works
	$("#openHowBtn")?.addEventListener("click", () => {
		openInfo(
			"How VivaSculpt works",
			`
			<div class="note">
				<p class="p"><strong>Framework:</strong> Train (HIIT) + Eat (protein-forward) + Optional gentle fasting + Recover.</p>
			</div>
			<div class="hr"></div>
			<ul class="list">
				<li><strong>15–25 minutes</strong> so you stay consistent.</li>
				<li>Choose <strong>Low‑Impact</strong> or <strong>Classic</strong> anytime.</li>
				<li>Meals: protein + fiber + healthy fats.</li>
				<li>Optional fasting: 12:12 → 14:10 → 16:8 if it feels easy.</li>
			</ul>
		`
		);
	});

	// Meals grocery list
	$("#genGroceryBtn")?.addEventListener("click", () => {
		const box = $("#groceryBox");
		box.style.display = "block";

		// Safe: controlled content (no user input)
		box.innerHTML = `
			<div class="note">
				<div class="h2">Grocery list (starter)</div>
				<ul class="list">
					<li>Eggs, Greek yogurt, cottage cheese (optional)</li>
					<li>Chicken/turkey or tofu/tempeh</li>
					<li>Salmon/tuna (or other fish)</li>
					<li>Oats, rice or potatoes</li>
					<li>Salad greens, cucumbers, tomatoes</li>
					<li>Broccoli/peppers/frozen vegetables</li>
					<li>Olive oil, avocados, nuts/nut butter</li>
					<li>Lemon, garlic, herbs/spices</li>
				</ul>
			</div>
		`;
	});

	// Kickstart “how to use”
	$("#openKickstartNote")?.addEventListener("click", () => {
		openInfo(
			"How to use Kickstart",
			`
			<ul class="list">
				<li>Do 3 workouts (Days 1/3/5), walk on recovery days.</li>
				<li>Pick Low‑Impact when joints are tired or space is limited.</li>
				<li>Eat protein-first meals; keep it simple.</li>
				<li>Track consistency, not perfection.</li>
			</ul>
		`
		);
	});

	// Pricing: start trial / choose pro
	$("#startTrialBtn")?.addEventListener("click", () => openModal("trialModal"));
	$("#goProBtn")?.addEventListener("click", () => paymentsComingSoon("Pro (no trial)"));
	$("#subscribeStarterBtn")?.addEventListener("click", () => paymentsComingSoon("Starter"));
	$("#subscribeProBtn")?.addEventListener("click", () => paymentsComingSoon("Pro"));
	$("#lockStarterBtn")?.addEventListener("click", () => paymentsComingSoon("Starter"));
	$("#lockProBtn")?.addEventListener("click", () => paymentsComingSoon("Pro"));
	$("#lockStarterBtn")?.addEventListener("click", () => paymentsComingSoon("Starter"));
	$("#lockProBtn")?.addEventListener("click", () => paymentsComingSoon("Pro"));
	$("#subscribeStarterBtn")?.addEventListener("click", () => paymentsComingSoon("Starter"));
	$("#subscribeProBtn")?.addEventListener("click", () => paymentsComingSoon("Pro"));
	$("#lockStarterBtn")?.addEventListener("click", () => paymentsComingSoon("Starter"));
	$("#lockProBtn")?.addEventListener("click", () => paymentsComingSoon("Pro"));
	$("#subscribeStarterBtn")?.addEventListener("click", () => paymentsComingSoon("Starter"));
	$("#subscribeProBtn")?.addEventListener("click", () => paymentsComingSoon("Pro"));

	// Trial confirm
	$("#confirmTrialBtn")?.addEventListener("click", () => {
		const email = $("#trialEmail").value;
		if (!validateEmail(email)) {
			openInfo("Email needed", `<div class="lock"><strong>Invalid email</strong><p class="p">Please enter a valid email to activate the demo trial.</p></div>`);
			return;
		}
		const next = setTrial(state, email);
		closeModal("trialModal");
		renderApp();
		openInfo(
			"Trial activated",
			`<div class="note"><p class="p"><strong>Starter trial is active.</strong> ${TRIAL_DAYS} days total. Days left: ${daysLeft(next)}.</p></div>`
		);
	});

	// Policy links
	document.querySelectorAll("[data-policy]").forEach((a) => {
		a.addEventListener("click", (e) => {
			e.preventDefault();
			const which = a.getAttribute("data-policy");
			if (which === "tos") openPolicy("Terms of Service", policyTos());
			if (which === "privacy") openPolicy("Privacy Policy", policyPrivacy());
			if (which === "regional") openPolicy("Regional Terms (EU/UK/US)", policyRegional());
		});
	});

	// Modal closing
	document.querySelectorAll("[data-close]").forEach((b) => {
		b.addEventListener("click", () => closeModal(b.getAttribute("data-close")));
	});
	$("#backdrop")?.addEventListener("click", () => {
		// Close topmost open modal (except lock modal)
		closeModal("workoutModal");
		closeModal("genericModal");
		closeModal("trialModal");
	});

	// Workout modal controls
	$("#pauseBtn")?.addEventListener("click", () => {
		player.isPaused = !player.isPaused;
		$("#pauseBtn").textContent = player.isPaused ? "Resume" : "Pause";
	});
	$("#nextBtn")?.addEventListener("click", () => {
		if (player.audioOn) beep();
		if (player.phase === "rest") {
			player.phase = "work";
			player.secLeft = player.workSec;
		}
		advanceMove();
		renderPlayer();
	});
	$("#endBtn")?.addEventListener("click", () => endWorkout());

	document.querySelectorAll(".audBtn").forEach((b) => {
		b.addEventListener("click", () => {
			player.audioOn = b.dataset.aud === "on";
			document.querySelectorAll(".audBtn").forEach((x) =>
				x.classList.toggle("is-on", x === b)
			);
		});
	});

	// If trial is expired, lock immediately
	if (trialOver) openLock();
}

function renderAccordion(containerId, workouts, intensity) {
	const container = $("#" + containerId);
	container.innerHTML = "";
	workouts.forEach((w, idx) => {
		const item = document.createElement("div");
		item.className = "acc-item";
		item.innerHTML = `
			<button class="acc-head" type="button" aria-expanded="false">
				<span>${escapeText(w.title)}</span>
				<span style="color:var(--muted)">▼</span>
			</button>
			<div class="acc-body">
				<p class="p">Intervals: 40s work / 20s rest · Choose Low‑Impact or Classic inside the player.</p>
				<div class="row" style="margin-top:10px">
					<button class="btn small primary" type="button">Start</button>
					<button class="btn small ghost" type="button">Details</button>
				</div>
			</div>
		`;
		container.appendChild(item);

		const head = item.querySelector(".acc-head");
		const body = item.querySelector(".acc-body");
		head.addEventListener("click", () => {
			const open = body.classList.toggle("is-open");
			head.setAttribute("aria-expanded", open ? "true" : "false");
		});

		const [startBtn, detailsBtn] = item.querySelectorAll("button.btn");
		startBtn.addEventListener("click", () => {
			const state = loadState();
			if (isTrialExpired(state)) {
				openLock();
				return;
			}
			resetPlayer({
				intensity,
				rounds: 2,
				lengthMin: 20,
				workoutId: w.id,
				audioOn: true,
			});
			openWorkout();
		});
		detailsBtn.addEventListener("click", () => {
			openInfo(
				"Workout details",
				`<ul class="list">
					<li><strong>${escapeText(w.title)}</strong></li>
					<li>Format: 40s work / 20s rest</li>
					<li>Choose Low‑Impact or Classic</li>
					<li>Focus on form and breathing</li>
				</ul>`
			);
		});
	});
}

function goto(name) {
	const state = loadState();
	if (isTrialExpired(state)) {
		openLock();
		return;
	}

	// Switch screens
	document.querySelectorAll(".screen").forEach((s) => s.classList.remove("is-active"));
	$("#screen-" + name).classList.add("is-active");

	// Tabs active state
	document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("is-active", t.dataset.go === name));
}

function openModal(id) {
	$("#backdrop").classList.add("is-on");
	$("#" + id).classList.add("is-on");
}
function closeModal(id) {
	const el = $("#" + id);
	if (!el) return;
	el.classList.remove("is-on");
	// If no other modals are open, hide backdrop
	const anyOpen = Array.from(document.querySelectorAll(".modal")).some((m) => m.classList.contains("is-on"));
	if (!anyOpen) $("#backdrop").classList.remove("is-on");
}
function openInfo(title, bodyHtml) {
	$("#genTitle").textContent = title;
	// bodyHtml is controlled by app code only (no user input)
	$("#genBody").innerHTML = bodyHtml;
	openModal("genericModal");
}
function openPolicy(title, html) {
	openInfo(title, html);
}

function paymentsComingSoon(planName) {
	openInfo(
		"Payments not enabled yet",
		`
		<div class="note">
			<p class="p"><strong>${escapeText(planName)}</strong> selected.</p>
			<p class="p">This static demo doesn’t process payments yet. To join the waitlist or get help, email <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.</p>
		</div>
		`
	);
}

function openWorkout() {
	openModal("workoutModal");
	renderPlayer();
	startTick();
}

function renderPlayer() {
	const move = player.moves[player.moveIndex] || player.moves[0];
	const nextMoveIndex = (player.moveIndex + 1) % player.moves.length;
	const nextMove = player.moves[nextMoveIndex];

	$("#playerSub").textContent = `${player.lengthMin} min · ${player.intensity === "low" ? "Low‑Impact" : "Classic"} · ${player.workSec}s/${player.restSec}s`;
	$("#playerMove").textContent = move.name;
	$("#playerMode").textContent = player.intensity === "low" ? "Low‑Impact mode" : "Classic mode";
	$("#playerPhase").textContent = player.phase.toUpperCase();
	$("#playerRound").textContent = `Round ${player.roundIndex}/${player.rounds}`;
	$("#playerNext").textContent = `Next: ${nextMove ? nextMove.name : "—"}`;
	$("#playerTime").textContent = String(player.secLeft);

	$("#moveLow").textContent = move.low;
	$("#moveClassic").textContent = move.classic;

	$("#playerHint").textContent =
		player.phase === "work"
			? "Work with strong form. Breathe."
			: "Rest. Shake it out. Get ready.";
}

function openLock() {
	openModal("lockModal");
}

// ---------- Policies (templates) ----------
function policyIntro() {
	return `
		<div class="note">
			<p class="p"><strong>Template notice:</strong> This is a general template for informational purposes and is not legal advice. For a real launch, consult a qualified legal professional.</p>
		</div>
		<div class="hr"></div>
	`;
}

function policyTos() {
	return `
		${policyIntro()}
		<p class="p"><strong>VivaSculpt Studio — Terms of Service</strong></p>
		<p class="p">Last updated: ${new Date().toISOString().slice(0,10)}</p>

		<div class="hr"></div>
		<p class="p"><strong>1) About the Service</strong><br>
		VivaSculpt Studio provides fitness and nutrition-related educational content, including home HIIT workouts, meal templates, and optional fasting guidance.</p>

		<p class="p"><strong>2) Not Medical Advice</strong><br>
		Content is for general informational purposes only and does not constitute medical advice. Always listen to your body and consult a qualified professional for medical concerns.</p>

		<p class="p"><strong>3) Eligibility</strong><br>
		This service is intended for users 18+ (or with parental consent where allowed).</p>

		<p class="p"><strong>4) Acceptable Use</strong><br>
		Do not misuse the service, attempt to interfere with functionality, or use it for unlawful purposes.</p>

		<p class="p"><strong>5) Trial & Subscriptions (Description)</strong><br>
		Starter: $14/month with a 7‑day trial. Pro: $29/month, no trial. After trial ends, a subscription is required to continue. (Note: this static demo does not process payments.)</p>

		<p class="p"><strong>6) Limitation of Liability</strong><br>
		To the maximum extent permitted by law, VivaSculpt Studio is not liable for any injury, loss, or damages arising from use of the service.</p>

		<p class="p"><strong>7) Contact</strong><br>
		Email: <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></p>
	`;
}

function policyPrivacy() {
	return `
		${policyIntro()}
		<p class="p"><strong>VivaSculpt Studio — Privacy Policy</strong></p>
		<p class="p">Last updated: ${new Date().toISOString().slice(0,10)}</p>

		<div class="hr"></div>
		<p class="p"><strong>1) What we collect</strong><br>
		In this static demo, we do not run a server and do not store accounts. Trial state may be stored locally in your browser (localStorage). If you enter an email, it may be stored locally on your device only (demo behavior).</p>

		<p class="p"><strong>2) Cookies / local storage</strong><br>
		We may use localStorage to remember trial status and basic preferences.</p>

		<p class="p"><strong>3) Third-party services</strong><br>
		This demo does not integrate third-party analytics or payment processors. A production version may use providers for subscriptions, email delivery, and analytics.</p>

		<p class="p"><strong>4) Your choices</strong><br>
		You can clear localStorage by clearing your browser/site data.</p>

		<p class="p"><strong>5) Contact</strong><br>
		Email: <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></p>
	`;
}

function policyRegional() {
	return `
		${policyIntro()}
		<div class="grid cols2">
			<div class="card" style="box-shadow:none">
				<div class="h2">EU/EEA (GDPR-oriented notes)</div>
				<ul class="list">
					<li><strong>Lawful basis:</strong> consent (e.g., email waitlist), and legitimate interests (service improvement) where applicable.</li>
					<li><strong>User rights:</strong> access, rectification, erasure, restriction, portability, objection.</li>
					<li><strong>Data minimization:</strong> collect only what’s needed.</li>
					<li><strong>Data processing:</strong> in a production app, use DPAs with processors and document transfers.</li>
				</ul>
			</div>
			<div class="card" style="box-shadow:none">
				<div class="h2">UK (UK GDPR)</div>
				<ul class="list">
					<li>Similar rights to EU GDPR; ensure UK-specific compliance if targeting UK users.</li>
					<li>Maintain records of processing and handle SARs within required timelines.</li>
				</ul>
			</div>
		</div>

		<div style="height:10px"></div>

		<div class="card" style="box-shadow:none">
			<div class="h2">US (CCPA/CPRA-style notes)</div>
			<ul class="list">
				<li>Provide notice at collection and describe categories of data collected.</li>
				<li>Offer rights to know/delete/correct (where applicable) and “Do Not Sell/Share” if relevant.</li>
				<li>If you use targeted advertising in production, you may need additional disclosures and opt-outs.</li>
			</ul>
			<div class="hr"></div>
			<p class="p"><strong>Contact:</strong> <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></p>
		</div>
	`;
}

// ---------- Boot ----------
renderApp();