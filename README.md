



Execute system login:

```javascript

target.login('<USER>','<PASSWORD>',function(status){
	console.log(status.message)
})

target.login('<USER>','<PASSWORD>',(status) => {console.log('user logged ? [',status.details.user,']');})


```

Check login status:

```javascript

target.isUserLogged((s)=>console.log('is logged user ? [',s.status,']'))

```

Check is in Home Page

```

target.isHomePage((s)=>console.log('is home page ? [',s.status,']'))

```

