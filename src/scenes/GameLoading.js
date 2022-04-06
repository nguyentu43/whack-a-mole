import Phaser from "../lib/phaser.js";

export default class GameLoading extends Phaser.Scene{
    constructor(){
        super('game-loading');
    }

    create(){
        this.add.text(0, 0, 'Loading...', { fontSize: 20, fontFamily: 'JosefinSans' });
        gapi.load('client', () => {
            gapi.client.init({
                'apiKey': 'AIzaSyB2mfRHM_obYIFlurn6ppe0Nv16PDr0818',
                'discoveryDocs': ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
              })
              .then(function() {
                return gapi.client.sheets.spreadsheets.values.get({
                  spreadsheetId: '19iTznIgB9Zz1gKH4QG5OUkSgKJ7yqwPZB0tngJPrBCc',
                  range: 'Content!A1:C999'
                });
              })
              .then((response) => {
                  const questions = response.result.values;
                  this.scene.get('game').setQuestions(questions);
                  this.scene.start('game');
              })
              .catch(function(error){
                  alert('Error Loading');
                  console.log(error);
              })
        });
    }
}