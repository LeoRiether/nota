window.API = (function () {
	"use strict";

	function AppViewModel() {
		this.periodos = [
			{ name: "1º Período", peso: 1.5 },
			{ name: "2º Período", peso: 2.5 },
			{ name: "3º Período", peso: 2.0 },
			{ name: "4º Período", peso: 4.0 }
		];
		this.periodo = ko.observable();
		this.materia = ko.observable('');
		this.teste = ko.observable();
		this.prova = ko.observable();
		this.formativa = ko.observable();
		this.extra = ko.observable();
		this.nota = ko.observable();

		this.materias =  [
			'arte', 'biologia', 'educacao fisica', 'filosofia', 'fisica',
			'geografia', 'historia', 'espanhol', 'ingles', 'portugues',
			'matematica', 'quimica', 'redacao', 'sociologia'
		];

		function _checkMateria(e) {
			return e.startsWith(this.materia().toLowerCase());
		}

		function _firstUpperCase(e) {
			return e[0].toUpperCase() + e.substr(1);
		}

		this.filterMaterias = ko.pureComputed(function () {
			return this.materias
				.filter(_checkMateria.bind(this))
				.map(_firstUpperCase.bind(this));
		}, this);

		this.showMateriaTip = ko.pureComputed(function () {
			var fm = this.filterMaterias();
			return fm.length > 0 &&
						 fm.length == 1 ?
						   this.materias.indexOf(this.materia().toLowerCase()) === -1 :
							 true &&
						 this.materia() !== '';
		}, this);

		this.chooseMateria = function (m) {
			this.materia(m);
		}.bind(this);

		this.resetMateria = function () {
			this.materia('');
		}.bind(this);

		function round(n) {
			return Math.round(n*10)/10;
		}

		function clamp(x, min, max) {
			return Math.min(Math.max(x, min), max)
		}

		var ff = function (a) { return a() ? parseFloat(a().replace(',', '.')) : 0; }

		// Number to comma separated string
		function _numbToCommaStr(n) { return n.toString().replace('.', ','); }

		this.calc = function () {
			var t = ff(this.teste),
				p = ff(this.prova),
				f = ff(this.formativa),
				e = ff(this.extra);
			var m = t*0.2 + p*0.7 + f*0.1 + e||0;
			m = clamp(m, 0, 10);
			var p = m * (this.periodo()||{peso:1.0}).peso;
			this.nota({
				media: _numbToCommaStr(round(m)),
				pontuacao: _numbToCommaStr(round(p))
			});
			this.addNota(this.materia(), this.nota().media, this.nota().pontuacao);
		};

		this.clear = function () {
			this.materia('');
			this.teste(null);
			this.prova(null);
			this.formativa(null);
			this.extra(null);
			this.nota(null);
		};

		this.notas = ko.observableArray();
		this.addNota = function (m, n, p) {
			this.notas.push({ materia: m, nota: n, pontuacao: p });
		};
	}

	var r = new AppViewModel();
	ko.applyBindings(r);
	return r;
})();
