const Entry = require('../models/entryScheme');
const Vote = require('../models/voteScheme');
const { DateTime } = require("luxon");

/**
 * Get the page titles from environmental
 * variables.
 */
const SITE_NAME = process.env.SITE_NAME;
const ABOUT_NAME = process.env.ABOUT_PAGE_TITLE;
const ARCHIVE_NAME = process.env.ARCHIVE_PAGE_TITLE;
const LAST_MONTH_NAME = process.env.LAST_BEST_PAGE_TITLE;
const ADD_ENTRY_NAME = process.env.ADD_ENTRY_PAGE_TITLE;
const VOTE_ENTRIES_NAME = process.env.VOTE_ENTRIES_PAGE_TITLE;

/**
 * Get the last month's starting and ending time
 * to query in database.
 */
const lastMonthStart = DateTime.now().plus({
    months: -1,
    days: -(DateTime.now().day - 1)
}).toISO();
const thisMonthStart = DateTime.now().plus({
    days: -(DateTime.now().day - 1)
}).toISO();
const thisMonthName = DateTime.now().setLocale(process.env.LOCALIZATON).toLocaleString({
    month: "long",
    year: "numeric"
});
const lastMonthName = DateTime.now().plus({months: -1}).setLocale(process.env.LOCALIZATON).toLocaleString({
    month: "long",
    year: "numeric"
});

exports.about = async (req, res) => {
    // Save the months' durations and their local titles.
    DateArray = [];
    DateArray.push({
        monthName: thisMonthName,
        entryCount: 0,
        startDate: thisMonthStart,
        endDate: DateTime.now().plus({days: -(DateTime.now().day - 1), months: 1}).toISO()
    });

    for (let element = -1; element > -6; element--) {
        DateArray.push({
            monthName: DateTime.now().plus({months: element}).setLocale(process.env.LOCALIZATON).toLocaleString({month: "long", year: "numeric"}),
            entryCount: 0,
            startDate: DateTime.now().plus({days: -(DateTime.now().day - 1), months: element}).toISO(),
            endDate: DateTime.now().plus({days: -(DateTime.now().day - 1), months: element + 1}).toISO()
        });
    }

    // Create a map of promises to find entry count in each month.
    const dateEntryCountBoxesPromises = DateArray.map(async dateArrayItem => {
        await Entry.find({
            createdAt: {
                $gte: dateArrayItem.startDate,
                $lt: dateArrayItem.endDate
            }
        })
        .then(foundData => {
            dateArrayItem.entryCount = foundData.length
        });
    });

    // Wait for all promises and render the page.
    Promise.all(dateEntryCountBoxesPromises).then(arrayOfResponses => {
        res.render("index", {
            page_title: ABOUT_NAME,
            site_title: SITE_NAME,
            about_title: ABOUT_NAME,
            entries_title: ARCHIVE_NAME,
            entry_add_title: ADD_ENTRY_NAME,
            vote_entries: VOTE_ENTRIES_NAME,
            last_month_winner: LAST_MONTH_NAME,
    
            monthsEntriesDetails: [
                {monthName: DateArray[0].monthName, entryCount: DateArray[0].entryCount},
                {monthName: DateArray[1].monthName, entryCount: DateArray[1].entryCount},
                {monthName: DateArray[2].monthName, entryCount: DateArray[2].entryCount},
                {monthName: DateArray[3].monthName, entryCount: DateArray[3].entryCount},
                {monthName: DateArray[4].monthName, entryCount: DateArray[4].entryCount},
                {monthName: DateArray[5].monthName, entryCount: DateArray[5].entryCount},
            ]
        });
    });
}

exports.entryArchive = async(req, res) => {    
    await Entry.find({})
    .then(databaseEntries => {
        databaseEntries.reverse();
        res.status(200).render("entryArchive", {
            page_title: ARCHIVE_NAME,
            site_title: SITE_NAME,
            about_title: ABOUT_NAME,
            entries_title: ARCHIVE_NAME,
            entry_add_title: ADD_ENTRY_NAME,
            vote_entries: VOTE_ENTRIES_NAME,
            last_month_winner: LAST_MONTH_NAME,
            
            entries: databaseEntries,
            error: null
        });
    })
    .catch(databaseError => {
        res.status(400).render("entryArchive", {
            page_title: ARCHIVE_NAME,
            site_title: SITE_NAME,
            about_title: ABOUT_NAME,
            entries_title: ARCHIVE_NAME,
            entry_add_title: ADD_ENTRY_NAME,
            vote_entries: VOTE_ENTRIES_NAME,
            last_month_winner: LAST_MONTH_NAME,
            
            entries: [],
            error: databaseError
        })
    });
}

exports.addEntry = async(req, res) => {
    res.render("addEntry", {
        page_title: ADD_ENTRY_NAME,
        site_title: SITE_NAME,
        about_title: ABOUT_NAME,
        entries_title: ARCHIVE_NAME,
        entry_add_title: ADD_ENTRY_NAME,
        vote_entries: VOTE_ENTRIES_NAME,
        last_month_winner: LAST_MONTH_NAME,

        error: false
    })
}

exports.voteEntries = async(req, res) => {
    let isUserVotedBefore = false;

    // Check if user voted before.
    await Vote.find({
        ipAddress: req.ip,
        $gte: thisMonthStart
    }).then(foundVote => {
        isUserVotedBefore = (foundVote.length > 0 ? true : false ) || (req.cookies.voterID == undefined ? false : true);
    })
    
    // Only search for last months entries.
    await Entry.find({
        createdAt: { $gte: thisMonthStart }
    })
    .then(databaseEntries => {
        databaseEntries.reverse();
        res.status(200).render("voteEntries", {
            page_title: VOTE_ENTRIES_NAME,
            site_title: SITE_NAME,
            about_title: ABOUT_NAME,
            entries_title: ARCHIVE_NAME,
            entry_add_title: ADD_ENTRY_NAME,
            vote_entries: VOTE_ENTRIES_NAME,
            last_month_winner: LAST_MONTH_NAME,
            
            entries: databaseEntries,
            currentMonthAndYear: thisMonthName,
            is_voted_before: isUserVotedBefore,
            error: null
        });
    })
    .catch(databaseError => {
        res.status(400).render("entryArchive", {
            page_title: VOTE_ENTRIES_NAME,
            site_title: SITE_NAME,
            about_title: ABOUT_NAME,
            entries_title: ARCHIVE_NAME,
            entry_add_title: ADD_ENTRY_NAME,
            vote_entries: VOTE_ENTRIES_NAME,
            last_month_winner: LAST_MONTH_NAME,
            
            entries: [],
            currentMonthAndYear: thisMonthName,
            is_voted_before: isUserVotedBefore,
            error: databaseError
        })
    });
}

exports.bestEntry = async(req, res) => {
    // Only search for last months entries.
    await Entry.find({
        createdAt: {
            $gte: lastMonthStart,
            $lte: thisMonthStart
        }
    })
    .sort({votes: -1})
    .then(databaseEntries => {
        res.status(200).render("bestEntry", {
            page_title: VOTE_ENTRIES_NAME,
            site_title: SITE_NAME,
            about_title: ABOUT_NAME,
            entries_title: ARCHIVE_NAME,
            entry_add_title: ADD_ENTRY_NAME,
            vote_entries: VOTE_ENTRIES_NAME,
            last_month_winner: LAST_MONTH_NAME,
            
            best_author: databaseEntries[0].nickname,
            best_entry: databaseEntries[0].text,
            currentMonthAndYear: lastMonthName,
            error: null
        });
    })
    .catch(databaseError => {
        res.status(400).render("bestEntry", {
            page_title: VOTE_ENTRIES_NAME,
            site_title: SITE_NAME,
            about_title: ABOUT_NAME,
            entries_title: ARCHIVE_NAME,
            entry_add_title: ADD_ENTRY_NAME,
            vote_entries: VOTE_ENTRIES_NAME,
            last_month_winner: LAST_MONTH_NAME,
            
            best_author: "Babişko Asuman!",
            best_entry: "Şu an veritabanımıza sızdığını size söyleyebiliriz. Lütfen sayfayı yenileyin!",
            currentMonthAndYear: lastMonthName,
            error: databaseError
        })
    });
}

exports.mostRecentEntry = async(req, res) => {
    await Entry.find({})
    .then(databaseEntries => {
        res.status(200).render("entryPage", {
            page_title: "En Güncel Torpil",
            site_title: SITE_NAME,
            about_title: ABOUT_NAME,
            entries_title: ARCHIVE_NAME,
            entry_add_title: ADD_ENTRY_NAME,
            vote_entries: VOTE_ENTRIES_NAME,
            last_month_winner: LAST_MONTH_NAME,
            
            entry: databaseEntries[0],
            error: null
        });
    })
    .catch(databaseError => {
        res.status(400).render("entryPage", {
            page_title: "En Güncel Torpil",
            site_title: SITE_NAME,
            about_title: ABOUT_NAME,
            entries_title: ARCHIVE_NAME,
            entry_add_title: ADD_ENTRY_NAME,
            vote_entries: VOTE_ENTRIES_NAME,
            last_month_winner: LAST_MONTH_NAME,
            
            entry: null,
            error: "Aradığınız entry bulunamadı. Belki de hiçbir torpil vakası girilmemiştir!"
        });
    });
}

exports.randomEntry = async(req, res) => {
    await Entry.find({})
    .then(databaseEntries => {
        entryCount = databaseEntries.length;
        randomEntryIndex = Math.floor(Math.random() * entryCount);

        res.status(200).render("entryPage", {
            page_title: "Rastgele Torpil",
            site_title: SITE_NAME,
            about_title: ABOUT_NAME,
            entries_title: ARCHIVE_NAME,
            entry_add_title: ADD_ENTRY_NAME,
            vote_entries: VOTE_ENTRIES_NAME,
            last_month_winner: LAST_MONTH_NAME,
            
            entry: databaseEntries[randomEntryIndex],
            error: null
        });
    })
    .catch(databseError => {
        res.status(200).render("entryPage", {
            page_title: "Rastgele Torpil",
            site_title: SITE_NAME,
            about_title: ABOUT_NAME,
            entries_title: ARCHIVE_NAME,
            entry_add_title: ADD_ENTRY_NAME,
            vote_entries: VOTE_ENTRIES_NAME,
            last_month_winner: LAST_MONTH_NAME,
            
            entry: null,
            error: databaseError
        });
    })
}

exports.votedCongrats = async(req, res) => {
    res.render("votedCongrats", {
        page_title: "Oylandı",
        site_title: SITE_NAME,
        about_title: ABOUT_NAME,
        entries_title: ARCHIVE_NAME,
        entry_add_title: ADD_ENTRY_NAME,
        vote_entries: VOTE_ENTRIES_NAME,
        last_month_winner: LAST_MONTH_NAME,
    });
}


/** POST REQUESTS */
exports.addEntryPost = async (req, res) => {  
    const paramText = req.body.text;
    if (req.body.nickname)
        paramNickname = req.body.nickname;    
    else
        paramNickname = "Anonim Asumanzede";
    
    const entry = new Entry({
        nickname: paramNickname, 
        text: paramText,
        date: DateTime.now().setLocale(process.env.LOCALIZATON).toFormat("dd MMMM yyyy"),
        entryId: Math.floor(Math.random() * 99999999)
    });
  
    entry.save()
      .then(data => res.redirect('/torpil-arsivi'))
      .catch(error => res.status(400).render('addEntry', {
            page_title: ADD_ENTRY_NAME,
            site_title: SITE_NAME,
            about_title: ABOUT_NAME,
            entries_title: ARCHIVE_NAME,
            entry_add_title: ADD_ENTRY_NAME,
            vote_entries: VOTE_ENTRIES_NAME,
            last_month_winner: LAST_MONTH_NAME,
            
            error: error,
            })
        );
  }

exports.voteEntryPost = async (req, res) => {
    nextMonthStart = new DateTime(thisMonthStart).plus({months: 1}).toISO();
    livingMinutesOfCookie = DateTime.now().diff(nextMonthStart, "days").toString();
    res.cookie("voterID", (Math.random()*999999999).toString(), {
        expires: livingMinutesOfCookie,
        httpOnly: true,
        sameSite: "lax"
    });
    
    if (req.body.entryId) {
        await Entry.findOneAndUpdate({entryId: parseInt(req.body.entryId)}, {$inc: {votes: 1}}).exec();
    }

    const vote = new Vote({
        entryId: parseInt(req.body.entryId),
        ipAddress: req.ip
    });

    vote.save()
    .then(obj => res.redirect("/oylandi"))
    .catch(databaseError => {
        res.status(400).render("voteEntries", {
            page_title: ARCHIVE_NAME,
            site_title: SITE_NAME,
            about_title: ABOUT_NAME,
            entries_title: ARCHIVE_NAME,
            entry_add_title: ADD_ENTRY_NAME,
            vote_entries: VOTE_ENTRIES_NAME,
            last_month_winner: LAST_MONTH_NAME,
            
            entries: [],
            currentMonthAndYear: thisMonthName,
            error: databaseError
        })
    });
}