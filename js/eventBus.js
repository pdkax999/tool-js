(function () {

  eventBus = {}
  /*

  可以绑定多个监听

  ｛
    key:[

    ]

   ｝

   */
  eventBus.callbacks = {

  }

  // eventBus

  /*
   更具事件名，存储对应回调 
    一，有则添加
    二，无则创建，对象添加 
   
   */
  eventBus.$on = function (name, callback) {

    let result = eventBus.callbacks[name]

    if (!result) {
      eventBus.callbacks[name] = [callback]
    } else {
      result.push(callback)
    }

  }
  eventBus.$once = function (name, callback) {
    name = `${name}__once`
    eventBus.$on(name, callback)
  }
  eventBus.$off = function (name, callback) {

    if (arguments.length === 0) {

      eventBus.callbacks = {}

    } else if (typeof name === 'string' && !callback) {

      delete eventBus.callbacks[name]

    } else {
      let index = eventBus.callbacks[name].indexOf(callback)
      if (index == 0) return
      eventBus.callbacks[name].splice(index, 1)
    }

  }
  eventBus.$emit = function (name, ...args) {
    let result
    
    result = eventBus.callbacks[name] ||eventBus.callbacks[name+="__once"] 
    
    if (!result && result.length==0) return
    result.forEach(call => {
      call(...args)
    });

    if (name.slice(-6) == "__once") {
      this.$off(name)
    }
  }
  window.eventBus = eventBus

})(window)