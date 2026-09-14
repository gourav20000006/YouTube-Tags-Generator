/**
 * YouTube Video Tag Generator - Admin JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
	const providerRadios = document.querySelectorAll('input[name="yttg_provider"]');
	const anthropicSection = document.getElementById('yttg-section-anthropic');
	const openaiSection = document.getElementById('yttg-section-openai');

	if (!providerRadios.length) return;

	providerRadios.forEach(function (radio) {
		radio.addEventListener('change', function () {
			// Update card styles
			document.querySelectorAll('.yttg-radio-card').forEach(function (card) {
				card.classList.remove('is-selected');
			});

			const parentLabel = radio.closest('.yttg-radio-card');
			if (parentLabel) {
				parentLabel.classList.add('is-selected');
			}

			// Toggle active section
			if (radio.value === 'openai') {
				if (anthropicSection) anthropicSection.style.display = 'none';
				if (openaiSection) openaiSection.style.display = 'block';
			} else {
				if (anthropicSection) anthropicSection.style.display = 'block';
				if (openaiSection) openaiSection.style.display = 'none';
			}
		});
	});
});
