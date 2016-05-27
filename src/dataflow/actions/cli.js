
export const renderCLI =  (req, res, next) => {

  return ()=>{

    $('#page-container').html(JST['cli/index']())
    res.end()

  }
}