import User from '../User'

console.log(User)

const test = async() => {

  try {
    const user = new User({
      username: 'hi'
    })

    console.log(user)

    user.username = 'hi2'

    console.log(await User.get('hi') instanceof User)

    console.log(await user.save())


  } catch(e){
    console.log(e.stack || e)
  }

}


test()
