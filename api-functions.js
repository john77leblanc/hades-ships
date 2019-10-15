const fs = require('fs');

module.exports = {
  getShips() {
    return JSON.parse(fs.readFileSync('./lib/ships.json','utf8'));
  },

  getShipsByType(ships, type) {
    return ships.find(ship => ship.type.toLowerCase() == type.toLowerCase());
  },

  getShipByLevel(ship, level) {
    return ship.find(s => s.level == level);
  },

  getMods(modules) {
    return JSON.parse(fs.readFileSync(`./lib/${modules}.json`,'utf8'));
  },

  getAllMods() {
    return fs.readdirSync('./lib').filter(file => file.indexOf('modules') > 0)
      .map(file => JSON.parse(fs.readFileSync('./lib/' + file,'utf8')));
  },

  getAllModNames(mods) {
    return mods.map(m => ({
        name: m.name,
        levels: m.data.map(l => l.level)
    }));
  },

  getModByName(mod, name) {
    return mod.find(m => m.name.toLowerCase() == name.toLowerCase());
  },

  getModByLevel(mod, level) {
    return mod.find(m => m.level == level);
  },

  getModKeyValue(mod, key) {
    return mod[key];
  },

  getByAt(mod, by, at) {
    return mod.find(m => m[by] == at);
  },

  checkResponse(response) {
    return typeof response != 'undefined' ? response : {data:false};
  },

  handleQuery(modules, req) {
    let response = modules;
    const q = req.query;

    if (q.name && q.key) {
      response = this.getModKeyValue(this.getModByName(response, q.name), q.key);
      if (q.by) {
        response = typeof q.at != 'undefined'
          ? this.getByAt(response, q.by, q.at)
          : 'You must specify an "at" value in your query.';
      }
    }
    else if (q.name) {
        response = q.name.toLowerCase() == "all"
            ? this.getAllModNames(response) 
            : this.checkResponse(this.getModByName(response, q.name)).data;
        if (response && q.level) {
            response = this.checkResponse(this.getModByLevel(response, q.level));
        }
    }
    return response ? response : 'Module not found. Please check your query.';
  }
}