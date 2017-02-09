import Setting from './model/setting'

const importSettings = async () => {

  try {
    await Setting.empty()

    // Setting.insert()


  } catch(e){
    console.error(e.stack)
  }

}


importSettings
