const { Message, Client, MessageEmbed } = require("discord.js");
const translate = require('translate-google');

module.exports= {
    name : 'translate',
    aliases: ['translate'],
    description: "Translates the text",
    usage: "<language> <text>\nExample: command en hola",
    cooldown: 5,
    userPermissions: [,],
    botPermissions: [,],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run : async(client, message, args) => {
        const language = args?.shift();
        if(!language) return message.reply("Language was not set!");
        if (!args.length) return message.reply("Please provide a text to translate!");
        const text = args.join(" ")

        translate(text, {to : `${language}`})
            .then(msg => {
                const transEmbed = new MessageEmbed()
                    .setColor("RED")
                    .addField("Raw", "```" + text + "```")
                    .addField("Translated", "```" + msg + "```")
                    .setTimestamp();
                message.reply({ embeds: [transEmbed] });  
            })
            .catch(err => {
                message.reply("An error has occured, try providing a valid language as first argument. \n I will send the list of codes on your DM's just in case!");
                message.author.send(`\n
                Abkhaz	ab	
                Afar	aa	
                Africanos	af	
                Akan	ak	
                Albania	sq	
                Amárico	am	
                Árabe	ar	
                Aragonés	an	
                Armenio	hy	
                Assamese	as	
                Avaric	av	
                Avestan	ae	
                Aymara	ay	
                Azerbaiyán	az	
                Bambara	bm	
                Bashkir	ba	
                Vasco	eu	
                Belarús	be	
                Bengalí	bn	
                Bihari	bh	
                Bislama	bi	
                Bosnia	bs	
                Breton	br	
                Búlgaro	bg	
                Burmese	my	
                Catalán	ca	
                Chamorro	ch	
                Chechenio	ce	
                Chichewa, Chewa, Nyanja	ny	
                Chino	zh	
                Chuvashia	cv	
                Cornualles	kw	
                Corso	co	
                Cree	cr	
                Croacia	hr	
                Checo	cs	
                Danés	da`);

            message.author.send(`\n    	
                Divehi, Dhivehi, Maldivas	dv	
                Holandés	nl	
                Dzongkha	dz	
                Inglés	en	
                Esperanto	eo	
                Estonia	et	
                Ewe	ee	
                Faroese	fo	
                Fiji	fj	
                Finlandés	fi	
                Francés	fr	
                Fula, Fulah, Pulaar, Pular	ff	
                Galicia	gl	
                Georgiano	ka	
                Alemán	de	
                Griego Moderno	el	
                Guaraní	gn	
                Gujarati	gu	
                Haitiano, creole haitiano	ht	
                Hausa	ha	hau
                Hebreo (moderno)	he	
                Herero	hz	
                Hindi	hi	
                Hiri Motu	ho	
                Húngaro	hu	
                Interlingua	ia	
                Indonesio	id	
                Interlingue	ie	
                Irlanda	ga	
                Igbo	ig	
                Inupiaq	ik	
                Ido	io	
                Islandés	is	
                Italiano	it	
                Inuktitut	iu	
                Japonés	ja	
                Javanés	jv	
                Kalaallisut, Groenlandia	kl	
                Canarés	kn	
                Kanuri	kr	
                Cachemira	ks	
                Kazajstán	kk	
                Khmer	km	
                Kikuyu, Gikuyu	ki	
                Kinyarwanda	rw	
                Kirguises, Kirguistán	ky	
                Komi	kv	
                Kongo	kg	
                Corea	ko`);

            message.author.send(`\n
                Kurdo	ku	
                Kwanyama, Kuanyama	kj	
                Latin	la	
                Luxemburgués, Luxemburgués	lb	
                Luganda	lg	
                Limburgués, Limburgan, Limburger	li	
                Lingala	ln	
                Lao	lo	
                Lituano	lt	
                Luba-Katanga	lu	
                Letonia	lv	
                Manx	gv	
                Macedonia	mk	
                Madagascar	mg	
                Malayo	ms	
                Malayalam	ml	
                Maltés	mt	
                Māori	mi	
                Maratí (Marathi)	mr	
                De las Islas Marshall	mh	
                Mongolia	mn	
                Nauru	na	
                Navajo, Navaho	nv	
                Noruego Bokmål	nb	
                Ndebele del Norte	nd	
                Nepali	ne	
                Ndonga	ng	
                Noruego Nynorsk	nn	
                Noruego	no	
                Nuosu	ii	
                Ndebele del sur	nr	
                Occitano	oc	
                Ojibwe, Ojibwa	oj	
                Oromo	om	
                Oriya	or	
                Osetia del Sur, osetio	os	
                Panjabi, Punjabi	pa	
                Pāli	pi	
                Persa	fa	
                Polaco	pl	
                Pashto, Pushto	ps	
                Portugués	pt	
                Quechua	qu	
                Romanche	rm`);
            	
            message.author.send(`\n
                Kirundi	rn	
                Rumania, Moldavia, Moldavan	ro	
                Ruso	ru	rus
                Sánscrito (samskrta)	sa	
                Sardo	sc	
                Sindhi	sd	
                Sami del norte	se	
                Samoa	sm	
                Sango	sg	
                Serbio	sr	
                Gaélico escocés, gaélico	gd	
                Shona	sn	
                Cingalés, singalés	si	
                Eslovaca	sk	
                Esloveno	sl	
                Somalí	so	
                Southern Sotho	st	
                Español, castellano	es	
                Sundanese	su	
                Swahili	sw	
                Swati	ss	
                Sueco	sv	
                Tamil	ta	
                Telugu	te	
                Tayikistán	tg	
                Tailandia	th	
                Tigrinya	ti	
                Tibetano estándar, Tibetano, Central	bo	
                Turkmenistán	tk	
                Tagalo	tl	
                Tswana	tn	
                Tonga (Islas Tonga)	to	
                Turco	tr	
                Tsonga	ts	
                Tártara	tt	
                Twi	tw	
                Tahitian	ty	
                Uighur, Uyghur	ug	
                Ucrania	uk	
                Urdu	ur	
                Uzbeko	uz	
                Venda	ve	
                Vietnamita	vi	
                Volapük	vo	
                Valonia	wa	
                Galés	cy	
                Wolof	wo	
                Oeste de Frisia	fy	
                Xhosa	xh	
                Yiddish	yi	
                Yoruba	yo	
                Zhuang, Chuang	za	
                Zulu	zu	`);
            }); 
    },
}