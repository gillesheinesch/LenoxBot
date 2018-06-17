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

		const buttons = document.getElementsByClassName('documentation-button');
		for (var indexofbuttons = 0; indexofbuttons < buttons.length; indexofbuttons++) {
			if (buttons[indexofbuttons].classList.contains('active')) {
				buttons[indexofbuttons].classList.remove('active');
			}
		}
		document.getElementById("administration-button").classList.add('active');
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

		const buttons = document.getElementsByClassName('documentation-button');
		for (var indexofbuttons = 0; indexofbuttons < buttons.length; indexofbuttons++) {
			if (buttons[indexofbuttons].classList.contains('active')) {
				buttons[indexofbuttons].classList.remove('active');
			}
		}
		document.getElementById("moderation-button").classList.add('active');
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

		const buttons = document.getElementsByClassName('documentation-button');
		for (var indexofbuttons = 0; indexofbuttons < buttons.length; indexofbuttons++) {
			if (buttons[indexofbuttons].classList.contains('active')) {
				buttons[indexofbuttons].classList.remove('active');
			}
		}
		document.getElementById("help-button").classList.add('active');
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

		const buttons = document.getElementsByClassName('documentation-button');
		for (var indexofbuttons = 0; indexofbuttons < buttons.length; indexofbuttons++) {
			if (buttons[indexofbuttons].classList.contains('active')) {
				buttons[indexofbuttons].classList.remove('active');
			}
		}
		document.getElementById("music-button").classList.add('active');
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

		const buttons = document.getElementsByClassName('documentation-button');
		for (var indexofbuttons = 0; indexofbuttons < buttons.length; indexofbuttons++) {
			if (buttons[indexofbuttons].classList.contains('active')) {
				buttons[indexofbuttons].classList.remove('active');
			}
		}
		document.getElementById("fun-button").classList.add('active');
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

		const buttons = document.getElementsByClassName('documentation-button');
		for (var indexofbuttons = 0; indexofbuttons < buttons.length; indexofbuttons++) {
			if (buttons[indexofbuttons].classList.contains('active')) {
				buttons[indexofbuttons].classList.remove('active');
			}
		}
		document.getElementById("searches-button").classList.add('active');
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

		const buttons = document.getElementsByClassName('documentation-button');
		for (var indexofbuttons = 0; indexofbuttons < buttons.length; indexofbuttons++) {
			if (buttons[indexofbuttons].classList.contains('active')) {
				buttons[indexofbuttons].classList.remove('active');
			}
		}
		document.getElementById("nsfw-button").classList.add('active');
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

		const buttons = document.getElementsByClassName('documentation-button');
		for (var indexofbuttons = 0; indexofbuttons < buttons.length; indexofbuttons++) {
			if (buttons[indexofbuttons].classList.contains('active')) {
				buttons[indexofbuttons].classList.remove('active');
			}
		}
		document.getElementById("application-button").classList.add('active');
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

		const buttons = document.getElementsByClassName('documentation-button');
		for (var indexofbuttons = 0; indexofbuttons < buttons.length; indexofbuttons++) {
			if (buttons[indexofbuttons].classList.contains('active')) {
				buttons[indexofbuttons].classList.remove('active');
			}
		}
		document.getElementById("currency-button").classList.add('active');
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

		const buttons = document.getElementsByClassName('documentation-button');
		for (var indexofbuttons = 0; indexofbuttons < buttons.length; indexofbuttons++) {
			if (buttons[indexofbuttons].classList.contains('active')) {
				buttons[indexofbuttons].classList.remove('active');
			}
		}
		document.getElementById("utility-button").classList.add('active');
	});

	document.getElementById('tickets-button').addEventListener('click', () => {
		var moderationelements = document.getElementsByClassName("tickets");
		for (var i3 = 0; i3 < moderationelements.length; i3++) {
			moderationelements[i3].style.display = "";
		}

		var otherelements = document.getElementsByClassName("command");
		for (var i = 0; i < otherelements.length; i++) {
			if (!otherelements[i].className.includes('tickets')) {
				otherelements[i].style.display = 'none';
			}
		}

		const buttons = document.getElementsByClassName('documentation-button');
		for (var indexofbuttons = 0; indexofbuttons < buttons.length; indexofbuttons++) {
			if (buttons[indexofbuttons].classList.contains('active')) {
				buttons[indexofbuttons].classList.remove('active');
			}
		}
		document.getElementById("tickets-button").classList.add('active');
	});

	document.getElementById('allcommands-button').addEventListener('click', () => {
		var moderationelements = document.getElementsByClassName("command");
		for (var i3 = 0; i3 < moderationelements.length; i3++) {
			moderationelements[i3].style.display = "";
		}

		const buttons = document.getElementsByClassName('documentation-button');
		for (var indexofbuttons = 0; indexofbuttons < buttons.length; indexofbuttons++) {
			if (buttons[indexofbuttons].classList.contains('active')) {
				buttons[indexofbuttons].classList.remove('active');
			}
		}
		document.getElementById("allcommands-button").classList.add('active');
	});
	$("#myInput").on("keyup", function () {
		var value = $(this).val().toLowerCase();
		$("#myTable tr").filter(function () {
			$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
		});
	});
});

function scrollTo(id) {
	$('html, body').animate({
		'scrollTop': $("#" + id).offset().top
	}, 1000, 'swing');
}