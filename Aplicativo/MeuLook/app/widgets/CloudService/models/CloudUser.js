/** @class widgets.CloudService.models.CloudUser
 * Representa as informações do usuário na nuvem do appcelerator.
 * @private
 * @alteracao 23/07/2015 183484 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @cfg {Number} CodigoUAU Código do usuario no UAU (codpes em UAU Cliente, coduser em UAU Corporativo).
 * @cfg {String} CloudId Id do usuário no appcelerator.
 * @cfg {String} login Login do usuário no appcelerator.
 * @cfg {String} SessionId Id da sessão do usuário.
 */
exports.definition = {
	config: {
		columns: {
		    "CodigoUAU": "integer",
		    "CloudId": "varchar PRIMARY KEY",
		    "Login": "varchar",
		    "SessionId": "varchar" 
		},
		adapter: {
			type: "sql",
			collection_name: "CloudUser",
			idAttribute: 'CloudId'
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};