const { response, request } = require('express');


const userGet = (req = request, res = response) => {
    const { q='NoN', nombre='NoN' } = req.query;
    res.json({
        ok: true,
        msg: 'User Get API',
        q,
        nombre
    })
  }

  const userPut = (req, res = response) => {
    const id = req.params.id
    res.json({
        ok: true,
        msg: 'User Put API',
        id
    })
  }

const userPost = (req, res = response) => {
    const body = req.body;
    res.json({
        ok: true,
        msg: 'User Post API',
        body
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