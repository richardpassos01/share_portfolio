import Koa from 'koa';

const serializer = async (ctx: Koa.Context, next: Koa.Next) => {
  await next();
  if (typeof ctx.body === 'object' && ctx.body !== null) {
    ctx.body = JSON.stringify(ctx.body);
    ctx.type = 'application/json';
  } else if (typeof ctx.body === 'string') {
    ctx.type = 'text/plain';
  }
};

export default serializer;
