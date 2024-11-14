# SkyDancers

# Opis projekta
Ovaj projekt je rezultat timskog rada u sklopu projeknog zadatka kolegija [Programsko inženjerstvo](https://www.fer.unizg.hr/predmet/proinz) na Fakultetu elektrotehnike i računarstva Sveučilišta u Zagrebu. 

SkyDancers je platforma za povezivanje plesača i direktora u plesnoj industriji. Dizajnirana kako bi olakšala proces audicija, SkyDancers omogućava plesnim direktorima da jednostavno pretražuju i pronalaze talentirane plesače za raznovrsne poslove i projekte. S druge strane, plesači imaju pristup sveobuhvatnom katalogu audicija i projekata, na kojem mogu pregledavati sve otvorene mogućnosti i prijaviti se na one koje im odgovaraju. Zbog nedostatka ovakvih aplikacija u regiji, SkyDancers bi mogao biti centralno mjesto koje bi povezivalo plesače i plesne direktore i pomoglo popularnosti i razvoju plesne industrije.

# Funkcijski zahtjevi
FR-1	Aplikacija omogućuje registraciju korisnika kao plesača ili plesnih direktora
 
FR-2	Prilikom registracije, plesači se registriraju besplatno, a plesni direktori uz plaćanje godišnje članarine

FR-3	Aplikacija omogućuje plaćanje članarine plesnim direktorima putem vanjskog servisa za plaćanje

FR-4	Aplikacija omogućuje plesnim direktorima objavljivanje audicija, s detaljima poput vremena, lokacije, opisa posla, vrsta traženih plesača, broja otvorenih pozicija i plaće

FR-5	Plesni direktori moraju moći pretraživati plesače koristeći filtre poput dobi, spola, vrste plesa.

FR-6	Plesači moraju moći pretraživati dostupne audicije pomoću filtara kao što su vrijeme, plaća, lokacija i vrsta plesa.

FR-7	Plesači moraju moći prijaviti se na odabrane audicije izravno putem aplikacije.

FR-8	Plesači moraju moći kreirati javni profil s osnovnim podacima (ime, prezime, lokacija, dob, spol) te portifolio koji uključuje slike ili snimke nastupa

FR-9	Plesači na profilu moraju moći označiti vrste plesa u kojima su iskusni

FR-10	Plesni direktori moraju moći kreirati javni profil s osnovnim podacima (ime, prezime, adresa, kontakt informacije) te portfolio svojih projekata i poslova.

FR-11	Plesni direktori moraju imati mogućnost slanja izravnih ponuda za poslove plesačima, neovisno o audicijama.

FR-12	Aplikacija mora omogućiti plesačima razmjenu poruka (čavrljanje) za komunikaciju.

FR-13	Aplikacija mora omogućiti plesačima javljanje plesnim direktorima preko poruka za više informacija o audiciji

FR-14	Plesači moraju imati mogućnost postaviti svoj profil kao "neaktivan" na određeno razdoblje, tijekom kojeg drugi korisnici ne mogu komunicirati s njima.

FR-15	Administratori sustava moraju imati mogućnost upravljanja korisničkim profilima plesača i plesnih direktora.

FR-16	Administratori moraju moći postaviti iznos godišnje članarine za plesne direktore.

FR-17	Aplikacija mora integrirati postojeći sustav za razmjenu poruka (npr. FreeChat) kako bi omogućila komunikaciju među korisnicima.

FR-18	Svaka audicija mora jasno prikazivati rok prijave za plesače, koji mora biti vidljiv na stranici audicije.

FR-19	Plesni direktori moraju imati mogućnost pregledavanja statistika prijava na audicije, uključujući broj prijavljenih plesača, vrste plesa i status prijava.

FR-20	Aplikacija mora omogućiti slanje notifikacija plesačima o novim audicijama na temelju njihovih preferencija (filtri poput vrste plesa, lokacije).

FR-21	Aplikacija mora omogućiti korisnicima promjenu lozinke i oporavak lozinke putem e-mail adrese.

FR-22	Plesni direktori moraju imati mogućnost filtriranja plesača na temelju njihovih specifičnih vještina, vrsta plesa i dostupnosti.

FR-23	Aplikacija mora omogućiti plesnim direktorima arhiviranje starih audicija i pregled arhiviranih podataka

FR-24	Aplikacija mora omogućiti korisnicima upravljanje svojim profilom, uključujući promjenu osnovnih podataka, dodavanje portfolia i ažuriranje statusa (aktivan/neaktivan).
	
	
NR-1	Aplikacija mora osigurati da su svi podaci korisnika zaštićeni.

NR-2	Aplikacija mora biti optimizirana kako bi podržala istovremeni rad velikog broja korisnika bez smanjenja performansi.

NR-3	Aplikacija mora biti skalabilna kako bi podržala rast baze korisnika i broj audicija bez utjecaja na stabilnost sustava.

NR-4	Aplikacija mora biti u potpunosti responzivna i funkcionalna na mobilnim uređajima

NR-5	Aplikacija mora podržavati hrvatski i engleski jezik


# Tehnologije
Front-end: React

Back-end: Spring

Baza podataka: PostgreSQL

Autentifikacija: OAuth 2.0/Firebase Authentication

Notifikacije i poruke: Firebase Cloud Messaging/FreeChat

Deployment: 

Plaćanje: 

# Članovi tima 

| Ime i prezime     |
| ----------------- |
| Barbara Glavina   |
| Katarina Bubalo   |
| Fani Jurak        |
| Luka Malešević    |
| Antonio Šimić     |
| Leonardo Klišanić |
| Mario Vukoja      |



# 📝 Kodeks ponašanja [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)
Kao studenti sigurno ste upoznati s minimumom prihvatljivog ponašanja definiran u [KODEKS PONAŠANJA STUDENATA FAKULTETA ELEKTROTEHNIKE I RAČUNARSTVA SVEUČILIŠTA U ZAGREBU](https://www.fer.hr/_download/repository/Kodeks_ponasanja_studenata_FER-a_procisceni_tekst_2016%5B1%5D.pdf), te dodatnim naputcima za timski rad na predmetu [Programsko inženjerstvo](https://wwww.fer.hr).
Očekujemo da ćete poštovati [etički kodeks IEEE-a](https://www.ieee.org/about/corporate/governance/p7-8.html) koji ima važnu obrazovnu funkciju sa svrhom postavljanja najviših standarda integriteta, odgovornog ponašanja i etičkog ponašanja u profesionalnim aktivnosti. Time profesionalna zajednica programskih inženjera definira opća načela koja definiranju  moralni karakter, donošenje važnih poslovnih odluka i uspostavljanje jasnih moralnih očekivanja za sve pripadnike zajenice.

Kodeks ponašanja skup je provedivih pravila koja služe za jasnu komunikaciju očekivanja i zahtjeva za rad zajednice/tima. Njime se jasno definiraju obaveze, prava, neprihvatljiva ponašanja te  odgovarajuće posljedice (za razliku od etičkog kodeksa). U ovom repozitoriju dan je jedan od široko prihvačenih kodeks ponašanja za rad u zajednici otvorenog koda.

# 📝 Licence

### Documentation License [![Documentation License](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

The documentation for this project is licensed under the [Attribution-NonCommercial-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-nc-sa/4.0/) license. This means that:

-   You may share and adapt the documentation, provided you give appropriate credit (attribution), do not use it for commercial purposes, and distribute any derivative works under the same license.

### Code License [![MIT License](https://img.shields.io/badge/License-MIT-blue)](https://opensource.org/licenses/MIT)

The code in this project is licensed under the [MIT License](https://opensource.org/licenses/MIT). This means that:

-   You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the code.
-   The code is provided "as is", without warranty of any kind.

### Media License [![MIT License](https://img.shields.io/badge/License-MIT-blue)](https://opensource.org/licenses/MIT)

The media assets in this project (images, videos, etc.) are also licensed under the [MIT License](https://opensource.org/licenses/MIT). This means that:

-   You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the media.
-   The media is provided "as is", without warranty of any kind.

####
