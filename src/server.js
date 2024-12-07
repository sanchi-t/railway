const app = require('./app');
const { sequelize, initModels } = require('./models');

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        await initModels();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the application:', error);
        process.exit(1);
    }
})();

