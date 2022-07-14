const Entry = require('../models/entryScheme');
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
    res.render("voteEntries", {
        page_title: VOTE_ENTRIES_NAME,
        site_title: SITE_NAME,
        about_title: ABOUT_NAME,
        entries_title: ARCHIVE_NAME,
        entry_add_title: ADD_ENTRY_NAME,
        vote_entries: VOTE_ENTRIES_NAME,
        last_month_winner: LAST_MONTH_NAME,
    })
}

exports.bestEntry = async(req, res) => {
    res.render("bestEntry", {
        page_title: LAST_MONTH_NAME,
        site_title: SITE_NAME,
        about_title: ABOUT_NAME,
        entries_title: ARCHIVE_NAME,
        entry_add_title: ADD_ENTRY_NAME,
        vote_entries: VOTE_ENTRIES_NAME,
        last_month_winner: LAST_MONTH_NAME,
    })
}

exports.mostRecentEntry = async(req, res) => {
    res.render("mostRecentEntry", {
        page_title: "En Güncel Torpil",
        site_title: SITE_NAME,
        about_title: ABOUT_NAME,
        entries_title: ARCHIVE_NAME,
        entry_add_title: ADD_ENTRY_NAME,
        vote_entries: VOTE_ENTRIES_NAME,
        last_month_winner: LAST_MONTH_NAME,
    })
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
        date: DateTime.local().setZone('UTC+3').toFormat("DDD")
    });
  
    entry
      .save()
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