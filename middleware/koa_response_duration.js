module.exports = async (ctx, next) => {
    const start = Date.now()

    const result = await next()

    const end = Date.now()

    const duration = end - start
    ctx.set('X-Response-Time', duration + 'ms')
}