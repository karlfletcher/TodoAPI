var bcrypt = require('bcryptjs');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports = function(sequelize, DataTypes){
	var user = sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		salt: {
			type: DataTypes.STRING
		},
		password_hash: {
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				len: [6, 100]
			},
			set: function(value){
				var salt = bcrypt.genSaltSync(10);
				var hashedPassword = bcrypt.hashSync(value, salt);

				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hashedPassword);
			}
		}
	},{
		hooks: {
			beforeValidate: function(user, options){
				if(typeof user.email === 'string')
					user.email = user.email.toLowerCase();
			},
			afterValidate: function(user, options){

			}
		},
		classMethods: {
			authenticate: function(body){
				return new Promise(function(resolve, reject){
					if(body.hasOwnProperty('email') && body.hasOwnProperty('password')){
						
						user.findOne({where: {email: body.email}}).then(function(user){
							if(!user || !bcrypt.compareSync(body.password, user.get('password_hash')))
								return reject();
							
							return resolve(user);

						}, function(error){
							return reject();
						});

					}else{
						return reject();
					}
				})
			},
			findByToken: function(token){

				return new Promise(function(resolve, reject){
					try{
						var decodedToken = jwt.verify(token, 'qwerty098');
						var bytes = cryptojs.AES.decrypt(decodedToken.token, 'abc123!@#!');
						var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));

						user.findById(tokenData.id).then(function(user){
							if(user)
								resolve(user);
							else
								reject();
						}, function(e){
							reject();
						})
					}catch(e){
						reject();
					}
				});
			}
		},
		instanceMethods:{
			toPublicJSON: function(){
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'updatedAt', 'createdAt');
			},
			generateToken: function(type){
				if(!_.isString(type))
					return undefined;

				try{
					var stringData = JSON.stringify({id: this.get('id'), type: type});
					var ecnryptedData = cryptojs.AES.encrypt(stringData, 'abc123!@#!').toString();

					var token = jwt.sign({
						token: ecnryptedData
					}, 'qwerty098');

					return token;
				}catch(e){
					console.log(e);
					return undefined;
				}
			}
		}
	});

	return user;
}