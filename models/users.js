

function Users(){

	var db=require("../config").db;
	var registerConfirmation=require("../config").registerConfirmation;
	
	return {

		addLocal : function (data, cb){

			var crypto = require('crypto');
			var encPass = crypto.createHash('sha256').update(data.userPassword).digest('hex');
			var activationHash = crypto.createHash('sha256').update("a"+data.userEmail+new Date().getTime()).digest('hex');
			
			if(registerConfirmation){
				var accEnable=false;
			}else{
				var accEnable=true;
			}
			
			db.users.insert({
								provider:"local",
								enable: accEnable,
								activationStatus: accEnable,
								activationHash:  activationHash,
								username: data.userEmail,
								password: encPass,
								displayName: data.userAlias, 
								name: {familyName: '', middleName: '', givenName: data.userAlias},
								emails: [{value:data.userEmail, type:'home'}],
								photos: []
							},function(e, d){
								cb(e,d);
							});
		},

		existLocal: function (username, cb){

			db.users.findOne({username: username}, function(e, d){
				
				if(e){
					 throw new Error('my silly error')
					 return;
				}else{
					cb(d);
				}

			})

		}

	}

}

module.exports=Users;