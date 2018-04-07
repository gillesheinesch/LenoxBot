$("document").ready(function () {
	document.getElementById('administration-button').addEventListener('click', () => {
		var administrationelements = document.getElementsByClassName("administration command");
		for (var i = 0; i < administrationelements.length; i++) {
			administrationelements[i].style.display = "";
		}

		var otherelements = document.getElementsByClassName("command");
		for (var index = 0; i < otherelements.length; i++) {
			if (!otherelements[i].className.includes('administration')) {
				otherelements[i].style.display = 'none';
			}
		}
	});

	document.getElementById('moderation-button').addEventListener('click', () => {
		var moderationelements = document.getElementsByClassName("moderation");
		for (var i3 = 0; i3 < moderationelements.length; i3++) {
			moderationelements[i3].style.display = "";
		}

		var otherelements = document.getElementsByClassName("command");
		for (var i = 0; i < otherelements.length; i++) {
			if (!otherelements[i].className.includes('moderation')) {
				otherelements[i].style.display = 'none';
			}
		}
	});

	document.getElementById('help-button').addEventListener('click', () => {
		var moderationelements = document.getElementsByClassName("help");
		for (var i3 = 0; i3 < moderationelements.length; i3++) {
			moderationelements[i3].style.display = "";
		}

		var otherelements = document.getElementsByClassName("command");
		for (var i = 0; i < otherelements.length; i++) {
			if (!otherelements[i].className.includes('help')) {
				otherelements[i].style.display = 'none';
			}
		}
	});

	document.getElementById('music-button').addEventListener('click', () => {
		var moderationelements = document.getElementsByClassName("music");
		for (var i3 = 0; i3 < moderationelements.length; i3++) {
			moderationelements[i3].style.display = "";
		}

		var otherelements = document.getElementsByClassName("command");
		for (var i = 0; i < otherelements.length; i++) {
			if (!otherelements[i].className.includes('music')) {
				otherelements[i].style.display = 'none';
			}
		}
	});

	document.getElementById('fun-button').addEventListener('click', () => {
		var moderationelements = document.getElementsByClassName("fun");
		for (var i3 = 0; i3 < moderationelements.length; i3++) {
			moderationelements[i3].style.display = "";
		}

		var otherelements = document.getElementsByClassName("command");
		for (var i = 0; i < otherelements.length; i++) {
			if (!otherelements[i].className.includes('fun')) {
				otherelements[i].style.display = 'none';
			}
		}
	});

	document.getElementById('searches-button').addEventListener('click', () => {
		var moderationelements = document.getElementsByClassName("searches");
		for (var i3 = 0; i3 < moderationelements.length; i3++) {
			moderationelements[i3].style.display = "";
		}

		var otherelements = document.getElementsByClassName("command");
		for (var i = 0; i < otherelements.length; i++) {
			if (!otherelements[i].className.includes('searches')) {
				otherelements[i].style.display = 'none';
			}
		}
	});

	document.getElementById('nsfw-button').addEventListener('click', () => {
		var moderationelements = document.getElementsByClassName("nsfw");
		for (var i3 = 0; i3 < moderationelements.length; i3++) {
			moderationelements[i3].style.display = "";
		}

		var otherelements = document.getElementsByClassName("command");
		for (var i = 0; i < otherelements.length; i++) {
			if (!otherelements[i].className.includes('nsfw')) {
				otherelements[i].style.display = 'none';
			}
		}
	});

	document.getElementById('application-button').addEventListener('click', () => {
		var moderationelements = document.getElementsByClassName("application");
		for (var i3 = 0; i3 < moderationelements.length; i3++) {
			moderationelements[i3].style.display = "";
		}

		var otherelements = document.getElementsByClassName("command");
		for (var i = 0; i < otherelements.length; i++) {
			if (!otherelements[i].className.includes('application')) {
				otherelements[i].style.display = 'none';
			}
		}
	});

	document.getElementById('currency-button').addEventListener('click', () => {
		var moderationelements = document.getElementsByClassName("currency");
		for (var i3 = 0; i3 < moderationelements.length; i3++) {
			moderationelements[i3].style.display = "";
		}

		var otherelements = document.getElementsByClassName("command");
		for (var i = 0; i < otherelements.length; i++) {
			if (!otherelements[i].className.includes('currency')) {
				otherelements[i].style.display = 'none';
			}
		}
	});

	document.getElementById('utility-button').addEventListener('click', () => {
		var moderationelements = document.getElementsByClassName("utility");
		for (var i3 = 0; i3 < moderationelements.length; i3++) {
			moderationelements[i3].style.display = "";
		}

		var otherelements = document.getElementsByClassName("command");
		for (var i = 0; i < otherelements.length; i++) {
			if (!otherelements[i].className.includes('utility')) {
				otherelements[i].style.display = 'none';
			}
		}
	});

	document.getElementById('allcommands-button').addEventListener('click', () => {
		var moderationelements = document.getElementsByClassName("command");
		for (var i3 = 0; i3 < moderationelements.length; i3++) {
			moderationelements[i3].style.display = "";
		}
	});
});

function scrollTo(id) {
	$('html, body').animate({
		'scrollTop': $("#" + id).offset().top
	}, 1000, 'swing');
}