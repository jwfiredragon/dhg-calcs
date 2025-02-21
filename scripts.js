const TOTAL_CORES = 6;
const ELITE_BAIT_VALS = [20, 25, 30, 40, 50];
const GROUP_EXPAND_VALS = [20, 25, 30, 40, 50];
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

		if (type == "progress") {
			progressTotal += ELITE_BAIT_VALS[Number(rarity)];
		} else if (type == "size") {
			sizeTotal += GROUP_EXPAND_VALS[Number(rarity)];
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

	document.getElementById("current-waves").textContent = `Waves per elite: ${currentWaves.toFixed(2)}`;
	document.getElementById("total-progress").textContent = `${progressTotal}%`;
	document.getElementById("total-size").textContent = `${sizeTotal}%`;
	document.getElementById("next-progress").textContent = `${Math.ceil(progressBreakpoint)}%`;
	document.getElementById("next-size").textContent = `${Math.ceil(sizeBreakpoint)}%`;
}