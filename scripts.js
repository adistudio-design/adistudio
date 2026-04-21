// Menu Function
const navbar = document.querySelector('nav');

function openMenu() {
    if (!navbar) return;
    navbar.classList.add('show');
    document.body.classList.add('menu-open');
}
function closeMenu() {
    if (!navbar) return;
    navbar.classList.remove('show');
    document.body.classList.remove('menu-open');
}

window.openMenu = openMenu;
window.closeMenu = closeMenu;

// Gallery Function
document.addEventListener('DOMContentLoaded', function () {
	function attachLightboxHandler(img) {
		img.style.cursor = 'zoom-in';
		img.addEventListener('click', (e) => {
			const groupRoot = img.closest('.container-portfolio-gallery') || img.closest('.image-carousel-track') || img.parentNode;
			const groupImages = Array.from(groupRoot.querySelectorAll('img'));
			let index = groupImages.indexOf(img);

			const overlay = document.createElement('div');
			overlay.className = 'lightbox-overlay';
			overlay.tabIndex = -1;

			const content = document.createElement('div');
			content.className = 'lightbox-content';

			const closeBtn = document.createElement('button');
			closeBtn.className = 'lightbox-close';
			closeBtn.setAttribute('aria-label', 'Close');
			closeBtn.innerHTML = '&times;';

			const bigImg = document.createElement('img');
			bigImg.src = img.src;
			bigImg.alt = img.alt || '';

			let prevBtn = null, nextBtn = null;
			if (groupImages.length > 1) {
				prevBtn = document.createElement('button');
				prevBtn.className = 'carousel-arrow carousel-prev';
				prevBtn.setAttribute('aria-label', 'Previous image');
				prevBtn.textContent = '<';

				nextBtn = document.createElement('button');
				nextBtn.className = 'carousel-arrow carousel-next';
				nextBtn.setAttribute('aria-label', 'Next image');
				nextBtn.textContent = '>';
			}

			content.appendChild(closeBtn);
			if (prevBtn) content.appendChild(prevBtn);
			content.appendChild(bigImg);
			if (nextBtn) content.appendChild(nextBtn);
			overlay.appendChild(content);
			document.body.appendChild(overlay);

			const prevOverflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';

			function showAt(i) {
				i = Math.max(0, Math.min(i, groupImages.length - 1));
				index = i;
				const source = groupImages[index].src;
				bigImg.src = source;
				bigImg.alt = groupImages[index].alt || '';
				if (prevBtn) {
					prevBtn.disabled = index === 0;
					prevBtn.setAttribute('aria-disabled', prevBtn.disabled);
				}
				if (nextBtn) {
					nextBtn.disabled = index === groupImages.length - 1;
					nextBtn.setAttribute('aria-disabled', nextBtn.disabled);
				}
			}

			const close = () => {
				if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
				document.body.style.overflow = prevOverflow || '';
				document.removeEventListener('keydown', onKey);
			};

			function onKey(ev) {
				if (ev.key === 'Escape') return close();
				if (ev.key === 'ArrowLeft') return (prevBtn && !prevBtn.disabled) ? showAt(index - 1) : null;
				if (ev.key === 'ArrowRight') return (nextBtn && !nextBtn.disabled) ? showAt(index + 1) : null;
			}

			overlay.addEventListener('click', (ev) => {
				if (ev.target === overlay) close();
			});
			closeBtn.addEventListener('click', close);
			if (prevBtn) prevBtn.addEventListener('click', () => showAt(index - 1));
			if (nextBtn) nextBtn.addEventListener('click', () => showAt(index + 1));
			document.addEventListener('keydown', onKey);

			showAt(index);
		});
	}

	const portfolioGallery = document.querySelector('.container-portfolio-gallery');
	if (portfolioGallery) {
		const portfolioImages = Array.from(portfolioGallery.querySelectorAll('img'));
		portfolioImages.forEach(attachLightboxHandler);
	}

	const track = document.querySelector('.image-carousel');
	if (track) {

	const trackInner = track.querySelector('.image-carousel-track');
	if (!trackInner) return;

	const images = Array.from(trackInner.querySelectorAll('img'));
	let index = 0;
	let currentTranslate = 0;

	const prevBtn = track.querySelector('.carousel-prev');
	const nextBtn = track.querySelector('.carousel-next');

	function scrollToIndex(i) {
		i = Math.max(0, Math.min(i, images.length - 1));
		index = i;
		const img = images[index];
		if (!img) return;
		const style = getComputedStyle(track);
		const paddingLeft = parseInt(style.paddingLeft || 0, 10);
		const paddingRight = parseInt(style.paddingRight || 0, 10);
		const visible = track.clientWidth - paddingLeft - paddingRight;
		const left = img.offsetLeft - paddingLeft;
		const maxTranslate = Math.max(0, trackInner.scrollWidth - visible);
		const translate = Math.min(Math.max(0, left), maxTranslate);
		trackInner.style.transform = `translateX(${-translate}px)`;
		currentTranslate = translate;
		if (prevBtn) {
			prevBtn.disabled = index === 0;
			prevBtn.setAttribute('aria-disabled', prevBtn.disabled);
		}
		if (nextBtn) {
			nextBtn.disabled = index === images.length - 1;
			nextBtn.setAttribute('aria-disabled', nextBtn.disabled);
		}
	}

	if (prevBtn) prevBtn.addEventListener('click', () => { if (prevBtn.disabled) return; scrollToIndex(index - 1); });
	if (nextBtn) nextBtn.addEventListener('click', () => { if (nextBtn.disabled) return; scrollToIndex(index + 1); });

	images.forEach(attachLightboxHandler);
	track.addEventListener('wheel', (e) => {
		if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
			e.preventDefault();
			const style = getComputedStyle(track);
			const paddingLeft = parseInt(style.paddingLeft || 0, 10);
			const paddingRight = parseInt(style.paddingRight || 0, 10);
			const visible = track.clientWidth - paddingLeft - paddingRight;
			const maxTranslate = Math.max(0, trackInner.scrollWidth - visible);

			let next = currentTranslate - e.deltaX;
			next = Math.min(Math.max(0, next), maxTranslate);
			trackInner.style.transform = `translateX(${-next}px)`;
			currentTranslate = next;

			let nearest = 0;
			let nearestDist = Infinity;
			images.forEach((img, i) => {
				const imgCenter = img.offsetLeft + img.offsetWidth / 2;
				const dist = Math.abs((currentTranslate + visible / 2) - imgCenter);
				if (dist < nearestDist) {
					nearestDist = dist;
					nearest = i;
				}
			});
			index = nearest;
			if (prevBtn) {
				prevBtn.disabled = index === 0;
				prevBtn.setAttribute('aria-disabled', prevBtn.disabled);
			}
			if (nextBtn) {
				nextBtn.disabled = index === images.length - 1;
				nextBtn.setAttribute('aria-disabled', nextBtn.disabled);
			}
		}
	}, { passive: false });

	window.addEventListener('resize', () => scrollToIndex(index));

	scrollToIndex(0);
	}

// Calculator Functions
	const calculatorRoot = document.getElementById('calculator');
	if (calculatorRoot) {
		const areaInput = calculatorRoot.querySelector('[calculator-step="1"] input[type="number"]');
		const areaDisplaySpan = document.querySelector('#calculator-area span');
		const structureSpan = document.querySelector('#calculator-structure span');
		const assemblySpan = document.querySelector('#calculator-assembly span');
		const installationSpan = document.querySelector('#calculator-installation span');
		const totalSpans = Array.from(document.querySelectorAll('#calculator-total span'));

		const assemblyOn = document.getElementById('assembly-on');
		const assemblyOff = document.getElementById('assembly-off');
		const installationOn = document.getElementById('installation-on');
		const installationOff = document.getElementById('installation-off');

		let X = 0;
		let structure = 0, assembly = 0, installation = 0;

		function fmt(n) { return Number.isFinite(n) ? n.toFixed(2) : '0.00'; }

		function updateDisplay() {
			if (areaDisplaySpan) areaDisplaySpan.textContent = X || 0;
			if (structureSpan) structureSpan.textContent = fmt(structure);
			if (assemblySpan) assemblySpan.textContent = fmt(assembly);
			if (installationSpan) installationSpan.textContent = fmt(installation);
			const total = (structure || 0) + (assembly || 0) + (installation || 0);
			totalSpans.forEach(s => s.textContent = fmt(total));
		}

		function computeStructure() { structure = Math.round((X * 87) * 100) / 100; }
		function computeAssembly() { assembly = (assemblyOn && assemblyOn.checked) ? Math.round((X * 8) * 100) / 100 : 0; }
		function computeInstallation() { installation = (installationOn && installationOn.checked) ? Math.round((X * 20) * 100) / 100 : 0; }

		function setRowOpacityFor(id, enabled) {
			const el = document.getElementById(id);
			if (!el) return;
			const row = el.closest('.calculator-row');
			if (!row) return;
			row.style.opacity = enabled ? '' : '0.3';
		}

		function applySelections() {
			computeStructure();
			if (assemblyOn && assemblyOn.checked) {
				assembly = Math.round((X * 8) * 100) / 100;
				setRowOpacityFor('calculator-assembly', true);
			} else {
				assembly = 0;
				setRowOpacityFor('calculator-assembly', false);
			}
			if (assemblyOff && assemblyOff.checked && installationOff) {
				installationOff.checked = true;
			}
			if (installationOn && installationOn.checked) {
				installation = Math.round((X * 20) * 100) / 100;
				setRowOpacityFor('calculator-installation', true);
			} else {
				installation = 0;
				setRowOpacityFor('calculator-installation', false);
			}

			updateDisplay();
		}

		[assemblyOn, assemblyOff, installationOn, installationOff].forEach(r => {
			if (!r) return;
			r.addEventListener('change', () => applySelections());
		});

		const nextButtons = Array.from(calculatorRoot.querySelectorAll('[id="calculator-btn-next"]'));
		nextButtons.forEach(btn => btn.addEventListener('click', (ev) => {
			ev.preventDefault();
			const currentStepEl = btn.closest('[calculator-step]');
			if (!currentStepEl) return;
			const current = parseInt(currentStepEl.getAttribute('calculator-step'), 10) || 0;

			if (current === 1) {
				const val = parseFloat(areaInput && areaInput.value ? areaInput.value : (areaInput ? areaInput.value : NaN));
				if (isNaN(val) || val <= 0) {
					if (areaInput) {
						areaInput.focus();
						areaInput.classList.add('input-error');
						setTimeout(() => areaInput.classList.remove('input-error'), 1200);
					}
					return;
				}
			}
			if (current === 2) {
				if (!(assemblyOn && assemblyOn.checked) && !(assemblyOff && assemblyOff.checked)) {
					if (assemblyOn) assemblyOn.focus();
					return;
				}
			}
			if (current === 3) {
				if (!(installationOn && installationOn.checked) && !(installationOff && installationOff.checked)) {
					if (installationOn) installationOn.focus();
					return;
				}
			}

			if (current === 4) {
				currentStepEl.classList.add('hidden');
				if (areaInput) areaInput.value = '';
				if (assemblyOn) assemblyOn.checked = false;
				if (assemblyOff) assemblyOff.checked = false;
				if (installationOn) installationOn.checked = false;
				if (installationOff) installationOff.checked = false;
				X = 0; structure = 0; assembly = 0; installation = 0;
				const s2 = calculatorRoot.querySelector('[calculator-step="2"]'); if (s2) s2.classList.add('hidden');
				const s3 = calculatorRoot.querySelector('[calculator-step="3"]'); if (s3) s3.classList.add('hidden');
				const s1 = calculatorRoot.querySelector('[calculator-step="1"]'); if (s1) s1.classList.remove('hidden');
				applySelections();
				return;
			}
			if (current === 1) {
				const val = parseFloat(areaInput && areaInput.value ? areaInput.value : (areaInput ? areaInput.value : NaN));
				X = (!isNaN(val) && val >= 0) ? val : 0;
			}

			applySelections();

			currentStepEl.classList.add('hidden');

			let next = current + 1;
			if (current === 2 && assemblyOff && assemblyOff.checked) next = 4;

			const nextEl = calculatorRoot.querySelector(`[calculator-step="${next}"]`);
			if (nextEl) nextEl.classList.remove('hidden');
			if (next === 4) applySelections();
		}));
	}
});


