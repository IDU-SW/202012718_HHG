class Games extends Sequelize.Model { }
Games.init({
    id: { 
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: Sequelize.STRING,
    publisher: Sequelize.STRING,
    year: Sequelize.INTEGER
}, {tableName:'games', sequelize, timestamps: false});

Games.sync().then(ret => {
    console.log('Sync Success :', ret);
    sequelize.close();
}).catch(error => {
    console.log('Sync Failure :', error);
});