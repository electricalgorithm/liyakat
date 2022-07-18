const Entry = require('../models/entryScheme');
const Vote = require('../models/voteScheme');
const { DateTime } = require("luxon");


const SITE_NAME = "Liyakat.org";
const ABOUT_NAME = "Nedir?";
const ARCHIVE_NAME = "Geçmiş Torpiller";
const LAST_MONTH_NAME = "Geçen Ayın En İyisi";
const ADD_ENTRY_NAME = "Torpil Ekle";
const VOTE_ENTRIES_NAME = "Oyla";


exports.about = async(req, res) => {
    res.render("index", {
        page_title: ABOUT_NAME,
        site_title: SITE_NAME,
        about_title: ABOUT_NAME,
        entries_title: ARCHIVE_NAME,
        entry_add_title: ADD_ENTRY_NAME,
        vote_entries: VOTE_ENTRIES_NAME,
        last_month_winner: LAST_MONTH_NAME
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
    let endDate = DateTime.now().toISO();
    let startDate = DateTime.now().plus({ months: -1 }).toISO();
    let CurrentMonthAndYear = "Temmuz 2022";
    let isUserVotedBefore = false;

    // Check if user voted before.
    await Vote.find({
        ipAddress: req.ip
    }).then(foundVote => {
        isUserVotedBefore = foundVote.length == 0 ? false : true;
    })
    
    // Only search for last months entries.
    await Entry.find({
        createdAt: {
            $gte: startDate,
            $lte: endDate
        }
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
            currentMonthAndYear: CurrentMonthAndYear,
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
            currentMonthAndYear: CurrentMonthAndYear,
            is_voted_before: isUserVotedBefore,
            error: databaseError
        })
    });
}

exports.bestEntry = async(req, res) => {
    let endDate = DateTime.now().plus({ months: -1 }).toISO();
    let startDate = DateTime.now().plus({ months: -2 }).toISO();
    let CurrentMonthAndYear = "Temmuz 2022";

    // Only search for last months entries.
    await Entry.find({
        createdAt: {
            $gte: startDate,
            $lte: endDate
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
            currentMonthAndYear: CurrentMonthAndYear,
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
            
            best_author: "Babişko Asuman!!!",
            best_entry: "Şu an veritabanımıza sızdığını size söyleyebiliriz. Lütfen sayfayı yenileyin!",
            currentMonthAndYear: CurrentMonthAndYear,
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
        })
    });
}

exports.randomEntry = async(req, res) => {
    res.render("randomEntry", {
        page_title: "Rastgele Torpil",
        site_title: SITE_NAME,
        about_title: ABOUT_NAME,
        entries_title: ARCHIVE_NAME,
        entry_add_title: ADD_ENTRY_NAME,
        vote_entries: VOTE_ENTRIES_NAME,
        last_month_winner: LAST_MONTH_NAME,
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
        date: DateTime.local().setZone('UTC+3').toFormat("DDD"),
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
    // Get the last month's entries.
    let endDate = DateTime.now().toISO();
    let startDate = DateTime.now().plus({ months: -1 }).toISO();
    let CurrentMonthAndYear = "Temmuz 2022";
    
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
            currentMonthAndYear: CurrentMonthAndYear,
            error: databaseError
        })
    });
    
    /*
    // Only search for last months entries.
    await Entry.find({
        createdAt: {
            $gte: startDate,
            $lte: endDate
        }
    })
    .then(databaseEntries => {
        // Validate the post request.
        if (req.body.entryId) {
            const entryToVote = databaseEntries.find(o => o.entryId === parseInt(req.body.entryId));
            if (entryToVote) {
        
                // Create the vote.
                const vote = new Vote({
                    entryId: req.body.entryId,
                    ipAddress: req.ip
                });
    
                // Save it to the database.
                vote.save()
                .then(data => res.redirect("/oylandi"))
                .catch(databaseError => res.status(400).render('voteEntries', {
                    page_title: VOTE_ENTRIES_NAME,
                    site_title: SITE_NAME,
                    about_title: ABOUT_NAME,
                    entries_title: ARCHIVE_NAME,
                    entry_add_title: ADD_ENTRY_NAME,
                    vote_entries: VOTE_ENTRIES_NAME,
                    last_month_winner: LAST_MONTH_NAME,
                    
                    entries: databaseEntriesToShow,
                    currentMonthAndYear: CurrentMonthAndYear,
                    error: databaseError
                    })
                );
            }
        }
    })
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
            currentMonthAndYear: CurrentMonthAndYear,
            error: databaseError
        })
    });

    */
}