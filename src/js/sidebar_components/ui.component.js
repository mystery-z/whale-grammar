/* global whale */

export function isSidebar() {
	const { dataset } = document.documentElement;
	const { userAgent } = window.navigator;
	const { href } = window.location;
	if(
		userAgent.includes(`sidebar`) &&
		dataset.useragent.includes(`sidebar`) &&
		href.includes(`whale-grammar`)
	) {
		return true;
	}

	return false;
}

function duplicateInspectButton(parentEl) {
	const buttonEl = parentEl.querySelector(`button`);
	const { innerText, className } = buttonEl;

	const nodeEl = document.createElement(`span`);
	nodeEl.innerText = innerText;
	nodeEl.className = className;

	buttonEl.parentNode.insertBefore(nodeEl, buttonEl);
}

function bindEventToNAVER() {
	const aEl = document.querySelector(`.service_logo`);
	aEl.target = `_blank`;
}

function renderExtensionSection() {
	const imgSrc = whale.runtime.getURL(`image/contest_logo.png`);
	const sectionEl = document.createElement(`section`);
	sectionEl.className = `sc extension-introduce`;
	sectionEl.innerHTML = `
		<div class="section-content">
			<img src="${imgSrc}" alt="whale-contest" />			
			<p class="title">웨일 확장앱 콘테스트 2019</p>
			<p class="description">본 확장앱은 웨일 확장앱 콘테스트 출품작입니다.</p>
		</div>
		<ul class="section-buttons">
			<li><a href="#">사용방법</a></li>
			<li><a href="#">버그신고</a></li>
			<li><a href="#">리뷰 남기기</a></li>
		</ul>
	`;

	return sectionEl;
}
function injectIntroduceSection(nodeEl) {
	const sectionEl = renderExtensionSection();
	const aEls = sectionEl.querySelectorAll(`a`);
	aEls.forEach(aEl => {
		aEl.addEventListener(`click`, function(e) {
			e.preventDefault();
			whale.runtime.sendMessage({
				action: `openURL`,
				options: { url: this.href }
			});
		});
	});

	nodeEl.parentElement.insertBefore(sectionEl, nodeEl.nextSibling);
}
function transformServiceLogo() {
	const imgEl = document.createElement(`img`);
	imgEl.src = whale.runtime.getURL(`image/naver_logo.png`);
	imgEl.alt = `NAVER`;
	imgEl.className = `whale-grammar-naver`;

	const headerEl = document.querySelector(`.api_title_area`);
	headerEl.appendChild(imgEl);

	const titleEl = headerEl.querySelector(`.api_title`);
	const { textContent } = titleEl.firstChild;
	titleEl.firstChild.textContent = textContent.replace(`네이버`, ``).trim();
}

export function transformDisplayComponents(sectionEl) {
	duplicateInspectButton(sectionEl);
	injectIntroduceSection(sectionEl);

	bindEventToNAVER();
	transformServiceLogo();
}

export function constructComponentController(sectionEl) {
	const inputEl = sectionEl.querySelector(`textarea`);
	const buttonEl = sectionEl.querySelector(`button.inspection`);
	const resultEl = sectionEl.querySelector(`.result_text`);

	return {
		inputEl,
		buttonEl,
		resultEl,

		setText: function(e) {
			if(typeof e !== typeof `string` || e.length < 1)
				return;

			this.inputEl.value = `${e}`;
		},
		runInspection: function() {
			this.buttonEl.click();
		},
		getResult: function(e) {
			return this.resultEl.textContent.trim();
		}
	}
}