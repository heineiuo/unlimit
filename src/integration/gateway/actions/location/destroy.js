const destroy = ({hostname}) => (ctx) => {
  return ctx.db.location.del(hostname)
};

export default destroy