import React from 'react';
import './Privacy.css';

const Privacy = () => {
    return (
        <div className="privacy-container">
            <h1>Datenschutzerklärung</h1>
            <div className="privacy-content">
                <p><strong>Letzte Änderung:</strong> 02.06.2024</p>

                <h2>Einleitung</h2>
                <p>Willkommen auf der Studien-Webseite studie.AusspracheTrainer.org. Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. In dieser Datenschutzerklärung erklären wir, wie wir Ihre personenbezogenen Daten erfassen und verarbeiten, wenn Sie unsere Dienste nutzen.</p>
                <p>Für bestimmte Dienste unserer Seite, wie die Audioaufnahmefunktion und die Erstellung eines Nutzerkontos, ist die Verarbeitung personenbezogener Daten erforderlich. Wir verarbeiten Ihre Daten nur in Übereinstimmung mit den gesetzlichen Datenschutzvorschriften.</p>
                <p>Bei der Benutzung der Audioaufnahmefunktion unserer Webseite wird Ihre aufgenommene Audio an Microsoft mit Standort in Deutschland übermittelt. Ebenfalls speichern wir Daten im Zusammenhang mit der Erstellung und Verwaltung von Nutzerkonten, einschließlich Ihrer E-Mail-Adresse.</p>
                <p>Zudem läuft der Datenverkehr unserer Webseite über Cloudflare, um eine sichere und effiziente Bereitstellung unserer Dienste zu gewährleisten.</p>
                <p>Diese Datenschutzerklärung gilt für studie.AusspracheTrainer.org (nachfolgend „wir“, „uns“, „unser“). Bitte lesen Sie diese Erklärung sorgfältig durch, um zu verstehen, wie wir Ihre personenbezogenen Daten behandeln.</p>

                <h2>Datenerfassung auf unserer Webseite</h2>
                <h3>Art der erfassten Daten</h3>
                <p>Bei der Benutzung unserer Webseite erheben wir verschiedene Arten von Daten, die für die Durchführung der Studie notwendig sind. Diese Daten umfassen:</p>
                <ul>
                    <li><strong>Audioaufnahmen:</strong> Wenn Nutzer den Rekorder-Button auf unserer Webseite betätigen und etwas aufnehmen, werden diese Audioaufnahmen erfasst. Die Aufnahme wird nach der Analyse sowohl von unserem Server, als auch von Microsoft gelöscht. Eine Ausnahme bilden die
                        Audioaufnahmen des ersten Aufnahmetests. Diese werden bis Abschluss des letzten Fragebogens und zweiten Tests gespeichert, dann re-analysiert und anschließend gelöscht.</li>
                    <li><strong>Ausspracheauswertungen:</strong> Nach der Analyse einer Audioaufnahme wird Microsofts Auswertung gespeichert und mit ihrer anonymen Nutzerkennung in Verbindung gebracht. So lässt sich Fortschritt analysieren.
                        Wenn Sie sich dafür entscheiden, die Studie frühzeitig zu beenden, also Ihren Account löschen und somit nicht mehr an der Studie teilnehmen möchten, werden Ihre gesamten Auswertungen gelöscht. Diese Aktion ist unwiderruflich.</li>
                    <li><strong>Fragebögen:</strong> In der Studie werden ihr Geschlecht, Alter, Familiarität mit der Fremdsprache, eigene Einschätzung der Aussprache-Fähigkeit sowie abschließend einige Fragen zur Einschätzung des Fortschritts in punkto Aussprache und der eigenen Motivation
                        abgefragt. Diese werden in Zusammenhang mit ihrer anonymen Nutzerkennung gespeichert.</li>
                    <li><strong>Nutzerkontodaten:</strong> Für wichtige Benachrichtigungen sowie Nutzerkonto-Aktionen (Löschen des Kontos & ändern des Benutzernamens) wird Ihre Mail Adresse zu Beginn der Studie abgefragt und zusammen mit ihrer anonymen Nutzerkennung gespeichert. Ihre Mail Adresse
                        wird niemals veröffentlicht.</li>
                    <li><strong>Verbindungsdaten:</strong> Durch die Nutzung unserer Webseite werden technische Informationen wie IP-Adresse, Besuchszeitpunkt, ungefährer Standort, Browser-Typ und Betriebssystem erfasst, die durch Cloudflare verarbeitet werden.</li>
                </ul>

                <h3>Wie wir Daten erfassen</h3>
                <ul>
                    <li><strong>Audioaufnahmen:</strong> Die Aufnahmen werden aktiv durch Nutzerinteraktion initiiert, indem sie den Rekorder-Button drücken und ihre Stimme aufzeichnen. Diese Aufnahmen werden dann an Microsoft-Server in Deutschland übermittelt.</li>
                    <li><strong>Ausspracheauswertungen:</strong> Die Aufnahmen werden anschließend von Microsoft verarbeitet und analysiert. Dabei wird eine detaillierte Auswertung zurückgegeben, die ein sekundengenaues Transkript mit verstandenen Lauten und Phonemen sowie Alternativen als auch verschiedene Scores zurückgibt.</li>
                    <li><strong>Fragebögen:</strong> Im Studienverlauf werden Ihnen zu Beginn und am Ende die Fragebögen zum ausfüllen bereitgestellt. Diese sind freiwillig und Sie können auch an der Studie teilnehmen, ohne sie auszufüllen.</li>
                    <li><strong>Nutzerkontodaten:</strong> Nutzerkontodaten werden erfasst, wenn sich Nutzer auf unserer Webseite registrieren und ein Konto erstellen. Diese Daten umfassen E-Mail-Adressen und alle weiteren Angaben, die während des Registrierungsprozesses gemacht werden.</li>
                    <li><strong>Verbindungsdaten:</strong> Cloudflare erfasst Daten wie IP-Adresse, ungefährer Standort und Browsertyp automatisch, wenn Nutzer auf unsere Webseite zugreifen. Diese Erfassung dient der Gewährleistung von Sicherheit und Leistung unserer Webdienste.</li>
                </ul>

                <h3>Zweck der Datenerfassung</h3>
                <ul>
                    <li><strong>Audioaufnahmen:</strong> Die Aufnahmen werden zur Bereitstellung spezifischer Funktionen unserer Webseite verwendet, beispielsweise zur Spracherkennung oder -verarbeitung.</li>
                    <li><strong>Ausspracheauswertungen:</strong> Je nachdem, ob der Nutzer zur Kontrollgruppe oder Experimentalgruppe gehört, wird die Analyse ihm vorenthalten oder direkt angezeigt. In jedem Fall wird sie gespeichert und kann
                        am Ende der Studie vom Nutzer heruntergeladen werden und wird anonymisiert im Rahmen der Publizierung der Studienergebnisse öffentlich geteilt.</li>
                    <li><strong>Nutzerkontodaten:</strong> Diese Daten werden verwendet, um Nutzerkonten zu verwalten, Dienste bereitzustellen und mit den Nutzern in Kontakt zu treten.</li>
                    <li><strong>Verbindungsdaten:</strong> Die durch Cloudflare erfassten Daten dienen der Verbesserung der Sicherheit und Performance der Webseite.</li>
                </ul>

                <h3>Rechtsgrundlage</h3>
                <p>Die Verarbeitung dieser Daten basiert auf verschiedenen Rechtsgrundlagen, abhängig von der Art der Daten und dem Zweck ihrer Verarbeitung. In der Regel stützt sich die Datenerfassung auf das berechtigte Interesse des Webseitenbetreibers (Art. 6 Abs. 1 lit. f DSGVO), die Erfüllung eines Vertrags oder vorvertraglicher Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO) oder die Einwilligung des Nutzers (Art. 6 Abs. 1 lit. a DSGVO).</p>

                <h3>Weiterführende Informationen</h3>
                <ul>
                    <li><a href="https://learn.microsoft.com/en-us/legal/cognitive-services/speech-service/speech-to-text/data-privacy-security">Datenschutzerklärung von Microsoft</a></li>
                    <li><a href="https://www.cloudflare.com/de-de/privacypolicy/">Datenschutzerklärung von Cloudflare</a></li>
                </ul>

                <h2>Nutzung der Audioaufnahmefunktion</h2>
                <h3>Funktionsweise der Audioaufnahme</h3>
                <p>Unsere Webseite bietet eine Funktion, mit der Nutzer Audioaufnahmen starten und beenden können.</p>

                <h3>Speicherung und Verarbeitung der Audioaufnahme</h3>
                <p>Die aufgezeichnete Audioaufnahme wird zunächst auf unserem Server gespeichert. Dort werden sie bearbeitet, um sicherzustellen, dass sie eine maximale Länge von 59 Sekunden nicht überschreiten. Mit Ausnahme der Audioaufnahmen des ersten Aussprachetests werden unmittelbar nach der Analyse werden die Aufnahmen von unserem Server gelöscht. Die Audioaufnahmen des ersten Aussprachetests werden nach Abschluss des letzten Fragebogens und zweiten Tests
                    re-analysiert und anschließend gelöscht.
                </p>

                <h3>Datenübermittlung an Microsoft</h3>
                <p>Zur Durchführung der Sprachanalyse werden die Audioaufnahmen an Microsoft (Standort Deutschland) übermittelt. Microsoft ist verantwortlich für die Transkription der Aufnahmen. Es ist wichtig zu erwähnen, dass Microsoft die Aufnahmen nicht speichert.</p>

                <h3>Einwilligung der Nutzer</h3>
                <p>Mit der aktiven Benutzung der Studienwebseite stimmen Sie wie im Login vermerkt zu, dass Sie die Einwilligungserklärung und Teilnehmeraufklärung gelesen
                    und verstanden haben, in der die datenschutzrechtlich relevanten Themen erläutert werden.
                </p>

                <h2>Nutzerkonten und Speicherung von E-Mail-Adressen</h2>
                <h3>Erstellung und Verwendung von Nutzerkonten</h3>
                <p>Nutzerkonten werden ausschließlich von der leitenden Lehrkraft der Studie erstellt. Die Lehrkraft gibt anschließend die Zugangsdaten (die sowohl als Nutzername, als auch als Passwort gelten) an teilnehmende
                    Schüler:innen aus, die im Verlauf der Studie weitere Daten angeben, die im Zusammenhang mit dem Nutzerkonto gespeichert werden.
                </p>

                <h3>Speicherung und Verwendung von E-Mail-Adressen</h3>
                <p>Ihre E-Mail-Adresse wird für wichtige Benachrichtigungen und Konto-Aktionen (Löschung und Änderung des Benutzernamens) verwendet. Sie wird nicht veröffentlicht.</p>

                <h3>Datenspeicherung und -löschung</h3>
                <p>Ihre Daten werden im Verlauf der Studie gesammelt und gespeichert. Nach Abschluss der Studie werden Sie anonymisiert veröffentlicht und für mindestens 10 Jahre gespeichert. Wenn Sie sich im Verlaufe der Studie dafür entscheiden, nicht mehr an der Studie teilzunehmen
                    und alle bisherigen Daten löschen möchten, können Sie das einfach tun, indem Sie Ihren Account löschen. Wenn Sie keinen Zugriff mehr auf Ihre Mail Adresse haben, können Sie alternativ auch eine Mail an kontakt@aussprachetrainer.org schreiben. Bitte beachten Sie,
                    dass diese Aktion unwiderruflich ist. Wenn Sie eine Mail schreiben statt den Account innerhalb der Webseite löschen, kann es sein, dass Ihr Account erst nach Abschluss der Studie gelöscht wird (d.h. nicht in der Auswertung berücksichtigt wird und die Daten
                    nicht veröffentlicht werden).
                </p>


                <h2>Verwendung von Cloudflare</h2>
                <p>In unserer Webseite nutzen wir Dienste von Cloudflare, Inc. ("Cloudflare"). Cloudflare bietet verschiedene Dienste an, die darauf abzielen, unsere Webseite schneller und sicherer zu machen. Dies schließt DNS-Weiterleitung und Proxy-Dienste ein.</p>
                <p><strong>DNS-Weiterleitung:</strong> Cloudflare verwaltet die DNS-Einstellungen unserer Webseite. Dies sorgt für eine effizientere und sichere Abwicklung der Internetanfragen, indem die Anfragen über Cloudflares Netzwerk geroutet werden.</p>
                <p><strong>Proxy-Dienste:</strong> Durch die Nutzung der Proxy-Dienste von Cloudflare wird der Datenverkehr zwischen den Besuchern unserer Webseite und unserem Server über Cloudflares Netzwerk geleitet. Dies hilft, unsere Webseite gegen DDoS-Angriffe zu schützen und die Ladezeiten zu verbessern.</p>
                <p>Cloudflare kann dabei bestimmte Informationen über die Besucher unserer Webseite erfassen, um diese Dienste bereitzustellen. Dazu gehören beispielsweise IP-Adressen, Systemkonfigurationsinformationen und andere Informationen über den Datenverkehr zu und von unserer Webseite.</p>
                <p>Weitere Informationen zu den von Cloudflare verarbeiteten Daten und deren Datenschutzpraktiken finden Sie in der <a href="https://www.cloudflare.com/de-de/privacypolicy/">Datenschutzrichtlinie von Cloudflare</a>.</p>
                <p>Bitte beachten Sie, dass wir keinen Einfluss auf die Art und Weise haben, wie Cloudflare die erfassten Daten verwendet und verarbeitet. Unsere Nutzung von Cloudflare basiert auf unserem berechtigten Interesse, unsere Webseite effizient und sicher zu betreiben.</p>

                <h2>Ihre Rechte als Nutzer</h2>
                <p>Als Nutzer unserer Webseite haben Sie verschiedene Rechte bezüglich Ihrer personenbezogenen Daten. Diese Rechte sind durch die Datenschutz-Grundverordnung (DSGVO) und andere relevante Datenschutzgesetze gewährleistet. Sie umfassen:</p>
                <ul>
                    <li><strong>Recht auf Auskunft:</strong> Sie haben das Recht, von uns eine Bestätigung darüber zu verlangen, ob personenbezogene Daten, die Sie betreffen, verarbeitet werden. Ist dies der Fall, so haben Sie ein Recht auf Auskunft über diese personenbezogenen Daten und auf weitere Informationen, wie beispielsweise die Verarbeitungszwecke, die Kategorien personenbezogener Daten, die betroffen sind, und die Empfänger oder Kategorien von Empfängern, gegenüber denen die personenbezogenen Daten offengelegt worden sind. Bitte beachten Sie, dass wir Ihnen keine anonymisierten Daten zuordnen können.</li>
                    <li><strong>Recht auf Berichtigung:</strong> Sie haben das Recht, die Berichtigung Sie betreffender unrichtiger personenbezogener Daten zu verlangen. Unter Berücksichtigung der Zwecke der Verarbeitung haben Sie auch das Recht, die Vervollständigung unvollständiger personenbezogener Daten zu verlangen.</li>
                    <li><strong>Recht auf Löschung („Recht auf Vergessenwerden“):</strong> In bestimmten Fällen können Sie die Löschung Ihrer personenbezogenen Daten verlangen, beispielsweise wenn die Daten für die Zwecke, für die sie erhoben wurden, nicht mehr notwendig sind oder wenn die Daten unrechtmäßig verarbeitet wurden. Bitte beachten Sie, dass wir keine anonymisierten Daten Ihnen zuordnen können und sie deshalb nicht löschen können.</li>
                    <li><strong>Recht auf Einschränkung der Verarbeitung:</strong> In bestimmten Fällen haben Sie das Recht, von uns die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Dies ist beispielsweise der Fall, wenn die Richtigkeit der Daten von Ihnen bestritten wird oder die Verarbeitung unrechtmäßig ist.</li>
                    <li><strong>Recht auf Datenübertragbarkeit:</strong> Sie haben das Recht, die Sie betreffenden personenbezogenen Daten, die Sie uns bereitgestellt haben, in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten, und Sie haben das Recht, diese Daten einem anderen Verantwortlichen ohne Behinderung durch uns zu übermitteln.</li>
                    <li><strong>Widerspruchsrecht:</strong> Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung Sie betreffender personenbezogener Daten, die aufgrund von Art. 6 Abs. 1 lit. e oder f DSGVO erfolgt, Widerspruch einzulegen.</li>
                </ul>
                <p>Bitte beachten Sie, dass diese Rechte unter bestimmten Bedingungen gelten und Ausnahmen unterliegen können. Wenn Sie eines dieser Rechte ausüben möchten, kontaktieren Sie uns bitte über die in dieser Datenschutzerklärung angegebenen Kontaktdaten. Wir werden Ihre Anfrage gemäß den geltenden Datenschutzgesetzen bearbeiten.</p>

                <h2>Datensicherheit</h2>
                <p>Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst und behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung. Unsere Webseite verwendet SSL- bzw. TLS-Verschlüsselung, um die Sicherheit Ihrer Daten während der Übertragung zu gewährleisten. Dies erkennen Sie an dem Schloss-Symbol in der Adresszeile Ihres Browsers und daran, dass die Adresszeile von "http://" auf "https://" wechselt.</p>
                <p>Zusätzlich setzen wir verschiedene Sicherheitsmaßnahmen ein, um Ihre Daten vor unbefugtem Zugriff, Verlust, Missbrauch oder Zerstörung zu schützen. Dazu gehören unter anderem regelmäßige Software-Updates, Firewalls und Sicherheitssysteme, die dem aktuellen Stand der Technik entsprechen.</p>
                <p>Bitte beachten Sie jedoch, dass die Datenübertragung im Internet grundsätzlich Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.</p>
                <p>Bei Fragen zur Sicherheit Ihrer persönlichen Daten können Sie sich jederzeit an uns wenden. Unsere Kontaktinformationen finden Sie im Abschnitt "Kontaktinformationen" dieser Datenschutzerklärung.</p>

                <h2>Änderungen der Datenschutzerklärung</h2>
                <p>Wir behalten uns das Recht vor, diese Datenschutzerklärung zu ändern, um sie an veränderte rechtliche Rahmenbedingungen oder Änderungen unserer Dienste sowie der Datenverarbeitung anzupassen. Dies gilt jedoch nur hinsichtlich Erklärungen zur Datenverarbeitung. Sofern Einwilligungen des Nutzers erforderlich sind oder Bestandteile der Datenschutzerklärung Regelungen des Vertragsverhältnisses mit den Nutzern enthalten, erfolgen Änderungen nur mit Zustimmung des Nutzers.</p>
                <p>Die Nutzer werden gebeten, sich regelmäßig über den Inhalt der Datenschutzerklärung zu informieren.</p>

                <h2>Kontaktinformationen</h2>
                <p>Bei Fragen zur Verarbeitung Ihrer persönlichen Daten oder zum Thema Datenschutz im Allgemeinen stehen wir Ihnen gerne zur Verfügung. Sie können uns wie folgt erreichen:</p>
                <p>
                    AusspracheTrainer g.e.V.<br />
                    c/o Dr. Oliver Busch<br />
                    Mühlgasse 8,<br />
                    60486 Frankfurt am Main<br />
                    <br />
                    E-Mail: kontakt@aussprachetrainer.org<br />
                    <br />
                    An dieser Mailadresse erreichen Sie auch unseren Datenschutzbeauftragen Daniel Busch.
                </p>
            </div>
        </div>
    );
};

export default Privacy;
