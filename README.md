## Synopsis
This project was written by team Incompeteam during the 24h Hackathon Hackaway (http://www.hackaway.com/).
Sponsored by Trafiklab, Ericsson, Drive Sweden and Nobina.

We retrieved data from Trafiklabs API:s and used it to visualize all current delays at bus stations in Stockholm using a heatmap.
The site is currently deployed on hackawaya4.firebaseapp.com and can be run locally using the command firebase serve.
The APIkeys used in the project right now have limited access, and the site therefore does not constinuously fetch new data. Right now it visualizes older data saved in the database.

## API Reference

All API:s are available here: https://www.trafiklab.se/api
This project fetches data from "SL Platsuppslag", "SL Realtidsinformation 4" and "SL Hållplatser och Linjer 2".


## License

Licensed under the BSD 2-Clause. See license file for more details.
