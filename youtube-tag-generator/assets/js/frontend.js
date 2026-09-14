/**
 * YouTube Video Tag Generator - Frontend Script
 * Modern Vanilla JavaScript (Zero jQuery dependency required)
 */

document.addEventListener('DOMContentLoaded', function () {
	const container = document.getElementById('yttg-app-container');
	if (!container) return;

	const form = document.getElementById('yttg-generator-form');
	const submitBtn = document.getElementById('yttg-submit-btn');
	const submitBtnText = submitBtn ? submitBtn.querySelector('.yttg-btn-text') : null;
	const resetBtn = document.getElementById('yttg-reset-btn');

	const loadingBox = document.getElementById('yttg-loading-box');
	const loadingText = document.getElementById('yttg-loading-text');

	const errorBox = document.getElementById('yttg-error-box');
	const errorText = document.getElementById('yttg-error-message');

	const resultsSection = document.getElementById('yttg-results-section');
	const chipsContainer = document.getElementById('yttg-tags-chips-container');
	const commaOutput = document.getElementById('yttg-comma-output');
	const copyAllBtn = document.getElementById('yttg-copy-all-btn');
	const copyBtnText = document.getElementById('yttg-copy-btn-text');

	let hasGeneratedOnce = false;
	let currentTags = [];
	let currentCommaString = '';

	// Fallback i18n messages
	const i18n = (window.yttg_vars && window.yttg_vars.i18n) || {
		generating: 'Generating your 20 tags...',
		researching: 'AI is researching the best SEO keywords...',
		generate_btn: 'Generate 20 Tags',
		regenerate_btn: 'Regenerate 20 Tags',
		copy_all: 'Copy All Tags',
		copied: '✓ 20 Tags Copied to Clipboard!',
		copy_failed: 'Failed to copy. Please manually copy from the box below.',
		empty_input: 'Please enter a video title or description before generating tags.',
		network_err: 'Network error. Please check your connection and try again.',
	};

	/**
	 * Display or hide error banner
	 */
	function showError(message) {
		if (errorBox && errorText) {
			errorText.textContent = message;
			errorBox.style.display = 'flex';
			errorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		}
	}

	function hideError() {
		if (errorBox) {
			errorBox.style.display = 'none';
		}
	}

	/**
	 * Toggle loading state
	 */
	function setLoading(isLoading, message) {
		if (isLoading) {
			hideError();
			if (submitBtn) {
				submitBtn.disabled = true;
				container.classList.add('yttg-loading');
				if (submitBtnText) {
					submitBtnText.textContent = i18n.generating;
				}
			}
			if (loadingBox) {
				if (loadingText && message) {
					loadingText.textContent = message;
				}
				loadingBox.style.display = 'flex';
			}
		} else {
			if (submitBtn) {
				submitBtn.disabled = false;
				container.classList.remove('yttg-loading');
				if (submitBtnText) {
					submitBtnText.textContent = hasGeneratedOnce ? i18n.regenerate_btn : i18n.generate_btn;
				}
			}
			if (loadingBox) {
				loadingBox.style.display = 'none';
			}
		}
	}

	/**
	 * Copy string to clipboard with modern API and reliable legacy fallback
	 */
	function copyToClipboard(text, onSuccess, onFail) {
		if (navigator.clipboard && window.isSecureContext) {
			navigator.clipboard.writeText(text)
				.then(onSuccess)
				.catch(function () {
					fallbackCopy(text, onSuccess, onFail);
				});
		} else {
			fallbackCopy(text, onSuccess, onFail);
		}
	}

	function fallbackCopy(text, onSuccess, onFail) {
		try {
			const textArea = document.createElement('textarea');
			textArea.value = text;
			textArea.style.position = 'fixed';
			textArea.style.left = '-999999px';
			textArea.style.top = '-999999px';
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			const successful = document.execCommand('copy');
			document.body.removeChild(textArea);
			if (successful) {
				onSuccess();
			} else if (onFail) {
				onFail();
			}
		} catch (err) {
			if (onFail) onFail(err);
		}
	}

	/**
	 * Render 20 tags in the UI
	 */
	function renderTags(tags, commaString) {
		currentTags = tags;
		currentCommaString = commaString;

		if (!chipsContainer) return;

		// 1. COMPLETELY CLEAR PREVIOUS TAGS (Regeneration requirement)
		chipsContainer.innerHTML = '';

		// 2. Render each tag chip
		tags.forEach(function (tag, index) {
			const chip = document.createElement('button');
			chip.type = 'button';
			chip.className = 'yttg-chip';
			chip.title = 'Click to copy this single tag';

			const indexSpan = document.createElement('span');
			indexSpan.className = 'yttg-chip-index';
			indexSpan.textContent = '#' + (index + 1);

			const textNode = document.createTextNode(tag);

			chip.appendChild(indexSpan);
			chip.appendChild(textNode);

			// Individual chip click to copy
			chip.addEventListener('click', function () {
				copyToClipboard(tag, function () {
					const originalText = chip.innerHTML;
					chip.style.backgroundColor = '#dcfce7';
					chip.style.borderColor = '#86efac';
					setTimeout(function () {
						chip.style.backgroundColor = '';
						chip.style.borderColor = '';
					}, 1000);
				});
			});

			chipsContainer.appendChild(chip);
		});

		// 3. Update comma-separated textarea
		if (commaOutput) {
			commaOutput.value = commaString;
		}

		// 4. Reveal results section
		if (resultsSection) {
			resultsSection.style.display = 'block';
			// Smooth scroll to results
			resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}

		// 5. Update state
		hasGeneratedOnce = true;
		if (resetBtn) {
			resetBtn.style.display = 'inline-flex';
		}
		if (submitBtnText) {
			submitBtnText.textContent = i18n.regenerate_btn;
		}
	}

	/**
	 * Form submit handler
	 */
	form.addEventListener('submit', function (e) {
		e.preventDefault();

		const titleInput = document.getElementById('yttg_video_title');
		const descInput = document.getElementById('yttg_video_description');
		const keywordInput = document.getElementById('yttg_main_keyword');
		const nicheInput = document.getElementById('yttg_video_niche');

		const titleVal = titleInput ? titleInput.value.trim() : '';
		const descVal = descInput ? descInput.value.trim() : '';
		const keywordVal = keywordInput ? keywordInput.value.trim() : '';
		const nicheVal = nicheInput ? nicheInput.value.trim() : '';

		if (!titleVal && !descVal) {
			showError(i18n.empty_input);
			if (titleInput) titleInput.focus();
			return;
		}

		// Prepare AJAX payload
		const ajaxUrl = (window.yttg_vars && window.yttg_vars.ajax_url) || '/wp-admin/admin-ajax.php';
		const nonce = (window.yttg_vars && window.yttg_vars.nonce) || '';

		const formData = new FormData();
		formData.append('action', 'yttg_generate_tags');
		formData.append('nonce', nonce);
		formData.append('title', titleVal);
		formData.append('description', descVal);
		formData.append('keyword', keywordVal);
		formData.append('niche', nicheVal);
		formData.append('regenerate', hasGeneratedOnce ? 'true' : 'false');

		setLoading(true, hasGeneratedOnce ? i18n.researching : i18n.generating);

		fetch(ajaxUrl, {
			method: 'POST',
			body: formData,
			credentials: 'same-origin',
		})
			.then(function (response) {
				return response.json().then(function (data) {
					return { status: response.status, ok: response.ok, data: data };
				});
			})
			.then(function (res) {
				setLoading(false);

				if (res.data && res.data.success && res.data.data && Array.isArray(res.data.data.tags)) {
					renderTags(res.data.data.tags, res.data.data.comma_separated || res.data.data.tags.join(', '));
				} else {
					const errorMsg = (res.data && res.data.data && res.data.data.message)
						|| (res.data && res.data.message)
						|| 'Unable to generate tags right now. Please try again.';
					showError(errorMsg);
				}
			})
			.catch(function (err) {
				setLoading(false);
				console.error('YTTG Fetch Error:', err);
				showError(i18n.network_err);
			});
	});

	/**
	 * Copy All Tags Button Handler
	 */
	if (copyAllBtn) {
		copyAllBtn.addEventListener('click', function () {
			if (!currentCommaString && commaOutput) {
				currentCommaString = commaOutput.value;
			}

			if (!currentCommaString) return;

			copyToClipboard(
				currentCommaString,
				function () {
					copyAllBtn.classList.add('is-copied');
					if (copyBtnText) copyBtnText.textContent = i18n.copied;

					setTimeout(function () {
						copyAllBtn.classList.remove('is-copied');
						if (copyBtnText) copyBtnText.textContent = i18n.copy_all;
					}, 2500);
				},
				function () {
					if (commaOutput) {
						commaOutput.focus();
						commaOutput.select();
					}
					alert(i18n.copy_failed);
				}
			);
		});
	}

	/**
	 * Reset Button Handler
	 */
	if (resetBtn) {
		resetBtn.addEventListener('click', function () {
			form.reset();
			hasGeneratedOnce = false;
			currentTags = [];
			currentCommaString = '';
			if (resultsSection) resultsSection.style.display = 'none';
			if (chipsContainer) chipsContainer.innerHTML = '';
			if (commaOutput) commaOutput.value = '';
			resetBtn.style.display = 'none';
			hideError();
			if (submitBtnText) submitBtnText.textContent = i18n.generate_btn;
		});
	}
});
