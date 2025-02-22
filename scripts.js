const TOTAL_CORES = 6;
const RARITY_MAP = ["common", "rare", "epic", "legendary", "chaotic"]
const ELITE_BAIT_VALS = [20, 25, 30, 40, 50];
const GROUP_EXPAND_VALS = [20, 25, 30, 40, 50];
const PROGRESS_TIERS = [4, 10, 16, 25, 40];
const SIZE_TIERS = [2, 5, 8, 12, 20];
const BASE_WAVE_SCALE = 0.049;

window.onload = (event) => {
	const rows = ["table-row-type", "table-row-rarity", "table-row-progress", "table-row-size"];

	const header = document.getElementById("table-row-header");
	const elem = header.lastElementChild;
	for (let i = 2; i <= TOTAL_CORES; i++) {
		let clone = elem.cloneNode(true);
		clone.textContent = `Core ${i}`
		header.appendChild(clone);
	}

	rows.forEach((r) => {
		const row = document.getElementById(r);
		const elem = row.lastElementChild;
		for (let i = 0; i < TOTAL_CORES - 1; i++) {
			let clone = elem.cloneNode(true);
			row.appendChild(clone);
		}
	});

	calculate();
};

function calculate() {
	let progressTotal;
	let sizeTotal;
	let currentWaves;
	let progressBreakpoint;
	let sizeBreakpoint;

	const progressArr = Array.from(document.getElementsByName("progress"));
	const sizeArr = Array.from(document.getElementsByName("size"));

	progressTotal = progressArr.reduce((a, c) => a + Number(c.value), 100);
	sizeTotal = sizeArr.reduce((a, c) => a + Number(c.value), 100);

	const typeRow = document.getElementById("table-row-type");
	const rarityRow = document.getElementById("table-row-rarity");

	for (let i = 1; i <= TOTAL_CORES; i++) {
		const type = typeRow.children[i].firstElementChild.value;
		const rarity = rarityRow.children[i].firstElementChild.value;
		const rarityIndex = RARITY_MAP.indexOf(rarity);

		if (type == "progress") {
			progressTotal += ELITE_BAIT_VALS[rarityIndex];
		} else if (type == "size") {
			sizeTotal += GROUP_EXPAND_VALS[rarityIndex];
		}
	}

	// W = 1/(P/100*S/100*B)
	// W = 10000/(P*S*B)
	currentWaves = 10000 / (progressTotal * sizeTotal * BASE_WAVE_SCALE);

	// W'   = 10000/((P+dP)*S*B)
	// P+dP = 10000/(S*B*W')
	// dP   = 10000/(S*B*W')-P
	const nextWaves = Math.floor(currentWaves);
	progressBreakpoint = 10000 / (sizeTotal * BASE_WAVE_SCALE * nextWaves) - progressTotal;
	sizeBreakpoint = 10000 / (progressTotal * BASE_WAVE_SCALE * nextWaves) - sizeTotal;

	// update display
	document.getElementById("current-waves").textContent = `${currentWaves.toFixed(2)}`;
	document.getElementById("total-progress").textContent = `${progressTotal}%`;
	document.getElementById("total-size").textContent = `${sizeTotal}%`;
	document.getElementById("next-progress").textContent = `${Math.ceil(progressBreakpoint)}%`;
	document.getElementById("next-size").textContent = `${Math.ceil(sizeBreakpoint)}%`;

	setColourInputs(progressArr, PROGRESS_TIERS);
	setColourInputs(sizeArr, SIZE_TIERS);

	document.getElementById("error-message").style.display =
		(document.getElementsByClassName("error").length > 0) ? "" : "none";
}

function setColourSelect(self) {
	self.className = `input ${self.options[self.selectedIndex].className}`;
}

function setColourInputs(inputArr, map) {
	inputArr.forEach((i) => {
		const val = Number(i.value);
		let rarity = 0;

		// if rarity goes out of bounds, map[rarity] evaluates to undefined, and val > undefined == false
		// so there's no need for explicit bounds checking
		while (val > map[rarity]) {
			rarity++;
		}

		i.className = `input ${(rarity < RARITY_MAP.length) ? RARITY_MAP[rarity] : "error"}`;
	});
}