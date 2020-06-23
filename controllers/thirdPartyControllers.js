const axios = require('axios');

module.exports = {
    randomUsersDataController: (req, res) => {
        axios
        .get('https://randomuser.me/api/?results=20')
        .then((randomUserDataRetrieved) => {
            let randomDataToBeProcessed = randomUserDataRetrieved.data.results
            let sortedRandomDataToBeProcessed = randomDataToBeProcessed.sort((a,b) => {
                let lNameA = a.name.last
                let lNameB = b.name.last
                return (lNameA < lNameB) ? -1 : (lNameA > lNameB) ? 1 : 0;
            });

            res.render('./main/random', { sortedRandomDataToBeProcessed });
            console.log(randomDataToBeProcessed)
        })
        .catch(error => console.log(error));
    },
    moviesPosterDescriptionController: (req, res) => {
        axios
            .get('https://api.themoviedb.org/3/movie/now_playing?api_key=210ef10af6939f8ab11d2f7a5e2c8a2f&language=en-US&page=1')
            .then((moviesDataRetrieved) => {
                let movieDataToBeProcessed = moviesDataRetrieved.data.results;
                res.render('./main/movies', {movieDataToBeProcessed});
            })
            .catch(error => console.log(error));
    }
}
