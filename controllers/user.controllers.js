const { response } = require('express');


const userGet = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'User Get API'
    })
  }

  const userPut = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'User Put API'
    })
  }

const userPost = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'User Post API'
    })
  }

  const userDelete = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'User Delete API'
    })
  }
  
  const userPatch = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'User Patch API'
    })
  }

module.exports = {
    userGet,
    userPut,
    userPost,
    userDelete,
    userPatch
}