(function (w) {

  Pubsub = {}

  Pubsub.callbacks = {}

  let id = 0
  /* 
  更具token取消消息  或者更具回调函数取消消息 
  ｛
    msg:{
     ['token']:
    }
   ｝
  */
  Pubsub.subscribe = function (msg, callback) {
    let token = 'uid_' + id++

    let result = Pubsub.callbacks[msg]
    if (!result) {
      Pubsub.callbacks[msg] = {
        [token]: callback
      }
    } else {

      result[token] = callback

    }
    return token
  }
  /*
   msg:消息名 ，data数据 ，  异步执行
   从容器中取出对应的callback执行 
   可能有多个，也可能没有
   */
  Pubsub.publish = function (msg, data) {

    let result = Pubsub.callbacks[msg]
    if (!result) return
    result = Object.values(result)
    if (result.length > 0) {

      result.forEach(call => {

        setTimeout(() => {
          call(msg, data)
        }, 0);

      });

    }


  }
  /*  没有传递参数，不取消消息的订阅
   传递消息名取消所有  一级
   更具绑定消息名时的返回值 取消 二级
   更具回调函数名，取消已绑定的回调 */
  Pubsub.unsubscribe = function (token) {

    if (!token) return
    let containerCallback = Pubsub.callbacks
    let CallbackArr = Object.values(containerCallback)
    let callbackList = CallbackArr.reduce((per, arr) => {
      let val = Object.keys(arr)
      per.push(val)
      return per
    }, [])

    if (typeof token == 'string' && token.indexOf('uid_') === 0) {

      CallbackArr.forEach((call) => {
        delete call[token]
      })

    } else if (typeof token == 'function') {

      callbackList.forEach((obj) => {

        obj.forEach((keys) => {

          remove(keys, token)

        })

      })
    } else {

      delete Pubsub.callbacks[token]

    }
  }
  Pubsub.publishSync = function (msg, data) {

    let result = Pubsub.callbacks[msg]
    if (!result) return
    result = Object.values(result)
    if (result.length > 0) {

      result.forEach(call => {

        call(msg, data)

      });
    }
  }
  // 删除一个对象的属性
  function remove(key, val) {
    let containerCallback = Pubsub.callbacks
    let CallbackArr = Object.values(containerCallback)
    CallbackArr.forEach((msgs) => {
      if (msgs[key] == val) {
        delete msgs[key]
      }
    })

  }

  w.Pubsub = Pubsub

})(window)