<?php
    session_start();
    if (isset($_GET["logout"])) {
        session_unset();
        session_destroy();
        header("Location: index.php"); // Redirect after logout
        exit();
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>Damareen</title>
    <script src="sortable.min.js"></script>
</head>
<body>
    <div class="screen-container" data-screen="home">
        <div class="screen screen--home">
            <nav>
                <h1 class="game-logo">Damareen</h1>
                <div class="account-section" data-logged-in=<?php if (isset($_SESSION["user_id"])){echo "true";}else{echo "false";}?>>
                    <div class="account-section-content account-logged-out">
                        <button class="button login-button--login">Bejelentkezés</button>
                        <button class="button login-button--register">Regisztráció</button>
                    </div>
                    <div class="account-section-content account-logged-in">
                        <div class="account-menu-open">
                            <div class="account-username"><?php echo $_SESSION["user_id"]; ?></div>
                            <svg class="svgbutton" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#000000"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-240v-32q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v32q0 33-23.5 56.5T720-160H240q-33 0-56.5-23.5T160-240Z"/></svg>
                            <input type="checkbox" id="account-menu-opened">
                        </div>
                        <div class="account-menu">
                            <div class="account-menu-item" id="account-btn-change-username">Névmódosítás</div>
                            <div class="account-menu-item" id="account-btn-change-password">Jelszómódosítás</div>
                            <div class="account-menu-item" id="account-btn-delete-account">Fiók törlése</div>
                            <div class="account-menu-item" id="account-btn-logout">Kijelentkezés</div>
                        </div>
                    </div>
                </div>
            </nav>
            <section class="section-worlds">
                <h3>Világok</h3>
                <div class="worlds-container">
                    <div class="world">
                        <div class="world-title">Első világ</div>
                        <div>Kártyák: 9</div>
                        <div>Vezérkártyák: 3</div>
                        <div>Kazamaták: 5</div>
                        <div class="world-buttons">
                            <svg class="world-play svgbutton" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M320-200v-560l440 280-440 280Z"/></svg>
                            <svg class="world-edit svgbutton" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M160-120q-17 0-28.5-11.5T120-160v-97q0-16 6-30.5t17-25.5l505-504q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L313-143q-11 11-25.5 17t-30.5 6h-97Zm544-528 56-56-56-56-56 56 56 56Z"/></svg>
                        </div>
                    </div>
                    <div class="world world--add">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z"/></svg>
                    </div>
                </div>
            </section>
        </div>
        <div class="screen screen--world">
            <div class="world-nav">
                <button class="svgbutton world-back-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m432-480 156 156q11 11 11 28t-11 28q-11 11-28 11t-28-11L348-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 28-11t28 11q11 11 11 28t-11 28L432-480Z"/></svg>
                </button>
                <h2>Világ létrehozása</h2>
                <input type="text" name="world-name" maxlength="32" class="input world-name" placeholder="A világ neve">
            </div>
            <div class="world-grid">
                <section class="section--worldcards">
                    <h3>Világkártyák</h3>
                    <div class="worldcards-container">
                        <form class="worldcard">
                            <div class="worldcard-grid">
                                <textarea placeholder="A kártya neve" name="worldcard-name" minlength="1" maxlength="16" class="worldcard-property worldcard-name" rows="2">Lorem Ipsum Dolor</textarea>
                                <div class="worldcard-property-container worldcard-attack-container">
                                    <svg class="worldcard-promote" data-boss-type="attack" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" xmlns:v="https://vecta.io/nano"><g stroke="#000"><path d="M81.18 327.439L500 19.098l418.82 308.341z" paint-order="normal" /><path d="M81.18 391.46L500 83.119 918.82 391.46z" fill="#000" paint-order="normal" /><path d="M81.18 545.166L500 236.825l418.82 308.341z" paint-order="normal" /><path d="M81.18 619.942L500 311.601l418.82 308.341z" fill="#000" paint-order="normal" /><path d="M81.18 773.649L500 465.308l418.82 308.341z" paint-order="normal" /><path d="M81.18 835.962L500 527.621l418.82 308.341z" fill="#000" paint-order="normal" /></g><path d="M81.18 989.668L500 681.327l418.82 308.341z" stroke="#fff" paint-order="normal" /></svg>
                                    <svg data-increment="1" class="worldcard-property-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 446 263" xmlns:v="https://vecta.io/nano"><path d="M223-864L67-708q-11 11-28 11-17 0-28-11-11-11-11-28 0-17 11-28l184-184q12-12 28-12 16 0 28 12l184 184q11 11 11 28 0 17-11 28-11 11-28 11-17 0-28-11z" /></svg>
                                    <div class="worldcard-property-icon-container">
                                        <img src="./assets/images/attack.webp" alt="Sebzés" class="worldcard-property-icon">
                                        <input type="number" name="attack" min="2" max="100" class="worldcard-property min-max-control integer worldcard-attack" value="100">
                                    </div>
                                    <svg data-increment="-1" class="worldcard-property-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 446 262" xmlns:v="https://vecta.io/nano"><path d="M223-698q-8 0-15-2.5-7-2.5-13-8.5L11-893Q0-904 0-921q0-17 11-28 11-11 28-11 17 0 28 11l156 156 156-156q11-11 28-11 17 0 28 11 11 11 11 28 0 17-11 28L251-709q-6 6-13 8.5-7 2.5-15 2.5z" /></svg>
                                </div>
                                <div class="worldcard-type-picker">
                                    <input type="radio" name="type" value="earth" checked>
                                    <input type="radio" name="type" value="fire">
                                    <input type="radio" name="type" value="water">
                                    <input type="radio" name="type" value="air">
                                </div>
                                <div class="worldcard-property-container worldcard-health-container">
                                    <svg class="worldcard-promote" data-boss-type="health" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" xmlns:v="https://vecta.io/nano"><g stroke="#000"><path d="M81.18 327.439L500 19.098l418.82 308.341z" paint-order="normal" /><path d="M81.18 391.46L500 83.119 918.82 391.46z" fill="#000" paint-order="normal" /><path d="M81.18 545.166L500 236.825l418.82 308.341z" paint-order="normal" /><path d="M81.18 619.942L500 311.601l418.82 308.341z" fill="#000" paint-order="normal" /><path d="M81.18 773.649L500 465.308l418.82 308.341z" paint-order="normal" /><path d="M81.18 835.962L500 527.621l418.82 308.341z" fill="#000" paint-order="normal" /></g><path d="M81.18 989.668L500 681.327l418.82 308.341z" stroke="#fff" paint-order="normal" /></svg>
                                    <svg data-increment="1" class="worldcard-property-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 446 263" xmlns:v="https://vecta.io/nano"><path d="M223-864L67-708q-11 11-28 11-17 0-28-11-11-11-11-28 0-17 11-28l184-184q12-12 28-12 16 0 28 12l184 184q11 11 11 28 0 17-11 28-11 11-28 11-17 0-28-11z" /></svg>
                                    <div class="worldcard-property-icon-container">
                                        <img src="./assets/images/health.webp" alt="Sebzés" class="worldcard-property-icon">
                                        <input type="number" name="health" min="1" max="100" class="worldcard-property min-max-control integer worldcard-health" value="100">
                                    </div>
                                    <svg data-increment="-1" class="worldcard-property-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 446 262" xmlns:v="https://vecta.io/nano"><path d="M223-698q-8 0-15-2.5-7-2.5-13-8.5L11-893Q0-904 0-921q0-17 11-28 11-11 28-11 17 0 28 11l156 156 156-156q11-11 28-11 17 0 28 11 11 11 11 28 0 17-11 28L251-709q-6 6-13 8.5-7 2.5-15 2.5z" /></svg>
                                </div>
                                <div class="worldcard-delete svgbutton">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z"/></svg>
                                </div>
                            </div>
                        </form>
                        <div class="worldcard worldcard--add">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z"/></svg>
                        </div>
                    </div>
                </section>
                <section class="section--casemate-cards">
                    <h3 class="casemate-cards-h3">A kazamata kártyái</h3>
                    <div class="casemate-cards-wrapper casemate-cards-ordinary-wraper">
                        <div class="casemate-cards-placeholder casemate-ordinary-placeholder"></div>
                        <div class="casemate-cards-container casemate-ordinary-container"></div>
                    </div>
                    <h3 class="casemate-boss-cards-h3">A kazamata vezérkártyái</h3>
                    <div class="casemate-cards-wrapper casemate-cards-boss-wrapper">
                        <div class="casemate-cards-placeholder casemate-boss-placeholder"></div>
                        <div class="casemate-cards-container casemate-boss-container"></div>
                    </div>
                </section>
                <section class="section--casemates">
                    <h3>Gyűjtemény</h3>
                    <div class="collections-container">
                        <div class="collection">A játékos gyűjteménye</div>
                    </div>
                    <h3>Kazamaták</h3>
                    <div class="casemates-container">
                        <form class="casemate">
                            <input class="input casemate-name"type="text" name="name" placeholder="Kazamata neve">
                            <label>
                                Típus:
                                <select class="input casemate-type" name="type">
                                    <option value="0">Egyszerű találkozás</option>
                                    <option value="1">Kis kazamata</option>
                                    <option value="2">Nagy kazamata</option>
                                </select>
                            </label>
                        </form>
                        <form class="casemate">
                            <input class="input casemate-name"type="text" name="name" placeholder="Kazamata neve" maxlength="32">
                            <label>
                                Típus:
                                <select class="input casemate-type" name="type">
                                    <option value="0">Egyszerű találkozás</option>
                                    <option value="1">Kis kazamata</option>
                                    <option value="2">Nagy kazamata</option>
                                </select>
                            </label>
                        </form>
                        <div class="casemate casemate--add">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z"/></svg>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>

    <dialog class="dialog" id="dialog--login">
        <h1>Bejelentkezés</h1>
        <svg class="dialog-close svgbutton" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z"/></svg>
        <form action="login_process.php" method="post" id="form-login">
            <label>
                Felhasználónév:
                <input class="input" type="text" minlength="4" maxlength="32" name="username" autocomplete="username" required>
            </label>
            <label>
                Jelszó:
                <input type="password" name="password" minlength="6" class="input" autocomplete="current-password" required>
            </label>
            <button class="button" type="submit">Bejelentkezés</button>
            <div class="form-error"></div>
        </form>
    </dialog>
    
    <dialog class="dialog" id="dialog--register">
        <h1>Regisztráció</h1>
        <svg class="dialog-close svgbutton" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z"/></svg>
        <form action="sign_in_process.php" method="post" id="form-register">
            <label>
                Felhasználónév:
                <input class="input" type="text" name="username" minlength="4" maxlength="32" autocomplete="username" required>
            </label>
            <label>
                Jelszó:
                <input type="password" name="password" class="input" minlength="6" autocomplete="new-password" required>
            </label>
            <label>
                Jelszó még egyszer:
                <input type="password" name="password-repeat" class="input" minlength="6" autocomplete="new-password" required>
            </label>
            <button class="button" type="submit">Regisztráció</button>
            <div class="form-error"></div>
        </form>
    </dialog>
    
    <dialog class="dialog" id="dialog--change-username">
        <h1>Névmódosítás</h1>
        <svg class="dialog-close svgbutton" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z"/></svg>
        <form action="username_modify_process.php" method="post" id="form-register">
            <label>
                Új Felhasználónév:
                <input class="input" type="text" name="new-username" minlength="4" maxlength="32" autocomplete="username" required>
            </label>
            <label>
                Jelszó:
                <input type="password" name="password" class="input" minlength="6" autocomplete="current-password" required>
            </label>
            <button class="button" type="submit">Módosítás</button>
            <div class="form-error"></div>
        </form>
    </dialog>
    
    <dialog class="dialog" id="dialog--change-password">
        <h1>Jelszómódosítás</h1>
        <svg class="dialog-close svgbutton" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z"/></svg>
        <form action="password_modify_process.php" method="post" id="form-register">
            <label>
                Jelenlegi jelszó:
                <input type="password" name="password" class="input" minlength="6" autocomplete="current-password" required>
            </label>
            <label>
                Új jelszó:
                <input type="password" name="new-password" class="input" minlength="6" autocomplete="new-password" required>
            </label>
            <label>
                Új jelszó még egyszer:
                <input type="password" name="new-password-repeat" class="input" minlength="6" autocomplete="new-password" required>
            </label>
            <button class="button" type="submit">Módosítás</button>
            <div class="form-error"></div>
        </form>
    </dialog>

    <dialog class="dialog" id="dialog--delete-account">
        <h1>Fiók törlése</h1>
        <svg class="dialog-close svgbutton" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z"/></svg>
        <form action="account_delete_process.php" method="post" id="form-register">
            <label>
                Jelszó:
                <input type="password" name="password" class="input" minlength="6" autocomplete="current-password" required>
            </label>
            <label>
                A fiók törléséhez írd be a felhasználónevedet
                <input class="input" type="text" name="username" minlength="4" maxlength="32" autocomplete="off" required>
            </label>
            <button class="button" type="submit">Fiók törlése</button>
            <div class="form-error"></div>
        </form>
    </dialog>


    <script src="script.js"></script>
</body>
</html>