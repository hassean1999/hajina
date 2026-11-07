const GART={
shadow:'<ellipse cx="50" cy="94" rx="30" ry="4" fill="#000" opacity=".28"/>',
heart:`<defs><radialGradient id="a" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FF9AAA"/><stop offset=".4" stop-color="#F2223F"/><stop offset="1" stop-color="#8A0620"/></radialGradient><linearGradient id="h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
<ellipse cx="50" cy="94" rx="26" ry="4" fill="#000" opacity=".25"/>
<path d="M50 88C20 67 6 51 6 33 6 19 17 9 30 9c10 0 16 6 20 13 4-7 10-13 20-13 13 0 24 10 24 24 0 18-14 34-44 55z" fill="url(#a)"/>
<path d="M50 88C70 74 86 60 92 44c-6 12-22 26-42 38z" fill="#5E0414" opacity=".35"/>
<ellipse cx="28" cy="25" rx="12" ry="7" transform="rotate(-35 28 25)" fill="url(#h)"/>
<circle cx="70" cy="21" r="4" fill="#fff" opacity=".7"/>`,
diamond:`<defs><linearGradient id="t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#9FF3FF"/></linearGradient></defs>
<ellipse cx="50" cy="95" rx="22" ry="3.5" fill="#000" opacity=".25"/>
<g stroke="#E8FDFF" stroke-width=".7" stroke-linejoin="round">
<path d="M8 36 32 14 28 36z" fill="#B9F6FF"/><path d="M28 36 32 14 50 36z" fill="#62D9F0"/><path d="M32 14H68L50 36z" fill="url(#t)"/><path d="M50 36 68 14 72 36z" fill="#3FC0E0"/><path d="M72 36 68 14 92 36z" fill="#1E8FC0"/>
<path d="M8 36H28L50 93z" fill="#8EEBFA"/><path d="M28 36H50V93z" fill="#36B8DD"/><path d="M50 36H72L50 93z" fill="#1A86BA"/><path d="M72 36H92L50 93z" fill="#0E5C8E"/>
<path d="M28 36 39 52 50 36 61 52 72 36" fill="none" stroke-opacity=".6"/></g>
<path d="M33 18 47 30" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".85"/>
<path d="M80 10l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#fff"/><path d="M18 58l1.4 4 4 1.4-4 1.4-1.4 4-1.4-4-4-1.4 4-1.4z" fill="#fff" opacity=".9"/>`,
crown:`<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6C2"/><stop offset=".35" stop-color="#FFD23F"/><stop offset=".75" stop-color="#D99A0B"/><stop offset="1" stop-color="#8F5C00"/></linearGradient><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE57A"/><stop offset=".5" stop-color="#E0A513"/><stop offset="1" stop-color="#7D4E00"/></linearGradient><radialGradient id="s" cx=".35" cy=".3"><stop offset="0" stop-color="#FFFBE0"/><stop offset=".5" stop-color="#FFC928"/><stop offset="1" stop-color="#A86E00"/></radialGradient><radialGradient id="r" cx=".35" cy=".3"><stop offset="0" stop-color="#FFB3BE"/><stop offset=".45" stop-color="#E3123A"/><stop offset="1" stop-color="#6B0018"/></radialGradient><radialGradient id="u" cx=".35" cy=".3"><stop offset="0" stop-color="#C9E6FF"/><stop offset=".45" stop-color="#1F6FE0"/><stop offset="1" stop-color="#0A2A6B"/></radialGradient></defs>
<ellipse cx="50" cy="93" rx="34" ry="4" fill="#000" opacity=".28"/>
<path d="M14 66 9 28 31 48 50 17 69 48 91 28 86 66z" fill="url(#g)" stroke="#8F5C00" stroke-width="1.2" stroke-linejoin="round"/>
<path d="M50 17 40 49 50 44 60 49z" fill="#fff" opacity=".22"/>
<rect x="12" y="62" width="76" height="24" rx="5" fill="url(#b)" stroke="#7D4E00" stroke-width="1.2"/>
<rect x="15" y="65" width="70" height="4" rx="2" fill="#fff" opacity=".45"/>
<ellipse cx="50" cy="75" rx="7" ry="6.5" fill="url(#r)" stroke="#FFE07A" stroke-width="1.5"/>
<ellipse cx="28" cy="75" rx="5" ry="4.6" fill="url(#u)" stroke="#FFE07A" stroke-width="1.3"/><ellipse cx="72" cy="75" rx="5" ry="4.6" fill="url(#u)" stroke="#FFE07A" stroke-width="1.3"/>
<circle cx="9" cy="27" r="5" fill="url(#s)"/><circle cx="50" cy="15" r="6" fill="url(#s)"/><circle cx="91" cy="27" r="5" fill="url(#s)"/>
<ellipse cx="50" cy="50" rx="4" ry="5" fill="url(#r)"/><ellipse cx="31" cy="55" rx="3" ry="3.6" fill="url(#u)"/><ellipse cx="69" cy="55" rx="3" ry="3.6" fill="url(#u)"/>`,
ring:`<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF4C4"/><stop offset=".3" stop-color="#F5C542"/><stop offset=".6" stop-color="#B9850F"/><stop offset=".8" stop-color="#FFE38A"/><stop offset="1" stop-color="#8A5A00"/></linearGradient><linearGradient id="t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#A8F0FF"/></linearGradient></defs>
<ellipse cx="50" cy="94" rx="28" ry="4" fill="#000" opacity=".25"/>
<ellipse cx="50" cy="64" rx="30" ry="24" fill="none" stroke="#7A4E00" stroke-width="11"/>
<ellipse cx="50" cy="64" rx="30" ry="24" fill="none" stroke="url(#g)" stroke-width="8.5"/>
<path d="M25 52C30 44 40 41 50 41" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>
<path d="M40 44 44 34H56L60 44z" fill="#C99A1E"/>
<g stroke="#EFFFFF" stroke-width=".5" stroke-linejoin="round"><path d="M30 24 40 12 39 24z" fill="#B9F6FF"/><path d="M39 24 40 12 50 24z" fill="#5CD3EE"/><path d="M40 12H60L50 24z" fill="url(#t)"/><path d="M50 24 60 12 61 24z" fill="#34B2DA"/><path d="M61 24 60 12 70 24z" fill="#1A84B8"/>
<path d="M30 24H39L50 42z" fill="#8EEBFA"/><path d="M39 24H50V42z" fill="#36B8DD"/><path d="M50 24H61L50 42z" fill="#1A86BA"/><path d="M61 24H70L50 42z" fill="#0E5C8E"/></g>
<path d="M78 6l1.6 4.6 4.6 1.6-4.6 1.6-1.6 4.6-1.6-4.6-4.6-1.6 4.6-1.6z" fill="#fff"/>`,
giftbox:`<defs><linearGradient id="l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F23A55"/><stop offset="1" stop-color="#B0122E"/></linearGradient><linearGradient id="r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C21535"/><stop offset="1" stop-color="#7A0A20"/></linearGradient><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFE68A"/><stop offset=".5" stop-color="#F2B91F"/><stop offset="1" stop-color="#B07A00"/></linearGradient><radialGradient id="k" cx=".4" cy=".35"><stop offset="0" stop-color="#FFF3B8"/><stop offset=".6" stop-color="#F2B91F"/><stop offset="1" stop-color="#9A6400"/></radialGradient></defs>
<ellipse cx="50" cy="93" rx="36" ry="4.5" fill="#000" opacity=".28"/>
<path d="M14 44 50 58V92L14 78z" fill="url(#l)"/><path d="M50 58 86 44V78L50 92z" fill="url(#r)"/>
<path d="M30 50.2 38 53.3V87.3L30 84.2z" fill="url(#g)"/><path d="M62 53.3 70 50.2V84.2L62 87.3z" fill="#C8900F"/>
<path d="M10 38 50 54V62L10 46z" fill="#E8304C"/><path d="M50 54 90 38V46L50 62z" fill="#9C0E28"/>
<path d="M10 38 50 22 90 38 50 54z" fill="#FF5C72"/>
<path d="M26 31.6 34 28.4 74 44.4 66 47.6z" fill="url(#g)"/><path d="M66 28.4 74 31.6 34 47.6 26 44.4z" fill="url(#g)"/>
<path d="M30 41.6 38 44.8V53.3L30 50.2z" fill="#F2B91F"/><path d="M62 44.8 70 41.6V50.2L62 53.3z" fill="#B07A00"/>
<path d="M50 38C38 20 24 22 28 30 31 36 44 38 50 38z" fill="url(#k)" stroke="#9A6400" stroke-width=".8"/><path d="M50 38C62 20 76 22 72 30 69 36 56 38 50 38z" fill="url(#k)" stroke="#9A6400" stroke-width=".8"/>
<ellipse cx="50" cy="37" rx="6" ry="4.5" fill="#F2B91F" stroke="#9A6400" stroke-width=".8"/>
<path d="M16 41 16 64" stroke="#fff" stroke-width="2" opacity=".35" stroke-linecap="round"/>`,
trophy:`<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9A6400"/><stop offset=".25" stop-color="#FFE47A"/><stop offset=".45" stop-color="#FFF8D6"/><stop offset=".7" stop-color="#E3A814"/><stop offset="1" stop-color="#8A5800"/></linearGradient><linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A2E14"/><stop offset="1" stop-color="#2E160A"/></linearGradient></defs>
<ellipse cx="50" cy="94" rx="28" ry="4" fill="#000" opacity=".28"/>
<path d="M26 22C10 22 10 46 30 48" fill="none" stroke="#C48A0C" stroke-width="5"/><path d="M74 22C90 22 90 46 70 48" fill="none" stroke="#C48A0C" stroke-width="5"/>
<path d="M24 14H76V30C76 52 64 62 50 62 36 62 24 52 24 30z" fill="url(#g)"/>
<ellipse cx="50" cy="14" rx="26" ry="5" fill="#B8800A"/><ellipse cx="50" cy="14" rx="23" ry="3.6" fill="#7A4C00"/>
<rect x="45" y="61" width="10" height="11" fill="url(#g)"/><path d="M36 72H64L66 76H34z" fill="url(#g)"/>
<path d="M28 76H72L74 92H26z" fill="url(#w)"/><rect x="38" y="80" width="24" height="7" rx="1.5" fill="url(#g)"/>
<path d="M50 24l3 6.4 7 .8-5.2 4.8 1.4 7-6.2-3.6-6.2 3.6 1.4-7L40 31.2l7-.8z" fill="#FFF3B8" opacity=".9"/>`,
balloon:`<defs><radialGradient id="a" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#FFB0BC"/><stop offset=".35" stop-color="#F2224A"/><stop offset="1" stop-color="#7E0620"/></radialGradient></defs>
<path d="M50 72C46 80 56 84 50 98" fill="none" stroke="#999" stroke-width="1.2"/>
<path d="M50 70C30 70 18 52 18 36 18 18 32 6 50 6s32 12 32 30c0 16-12 34-32 34z" fill="url(#a)"/>
<path d="M46 76 50 69 54 76z" fill="#A00C2C"/>
<ellipse cx="36" cy="24" rx="7" ry="11" transform="rotate(30 36 24)" fill="#fff" opacity=".55"/><circle cx="44" cy="40" r="2.5" fill="#fff" opacity=".4"/>`,
rose:`<defs><radialGradient id="p" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#FF6B7E"/><stop offset=".55" stop-color="#D8102E"/><stop offset="1" stop-color="#6E0414"/></radialGradient><linearGradient id="d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9E0A22"/><stop offset="1" stop-color="#4E0210"/></linearGradient><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF4A62"/><stop offset="1" stop-color="#A80A26"/></linearGradient><linearGradient id="l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7EE07A"/><stop offset="1" stop-color="#1E7A2A"/></linearGradient></defs>
<path d="M50 60C51 74 48 84 45 97" fill="none" stroke="#2A7A30" stroke-width="3.5" stroke-linecap="round"/>
<path d="M48 78C36 70 24 74 20 82 30 86 42 84 48 78z" fill="url(#l)"/><path d="M49 70C60 62 72 64 78 70 70 76 58 76 49 70z" fill="url(#l)"/>
<path d="M22 30C20 12 38 4 50 14 62 4 80 12 78 30 70 24 30 24 22 30z" fill="url(#d)"/>
<path d="M22 30C18 50 32 64 50 64S82 50 78 30C72 40 62 44 50 44S28 40 22 30z" fill="url(#p)"/>
<ellipse cx="50" cy="29" rx="22" ry="12" fill="#C40C2A"/>
<path d="M36 28C38 18 60 16 64 26 60 22 44 22 42 30 46 26 56 26 56 32 52 30 48 32 48 34" fill="none" stroke="#6A0214" stroke-width="2.2" stroke-linecap="round"/>
<path d="M28 34C34 50 66 50 72 34 70 54 30 54 28 34z" fill="url(#f)"/>
<path d="M30 38C34 46 44 49 50 49" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".5"/>
<ellipse cx="38" cy="22" rx="6" ry="2.5" transform="rotate(-20 38 22)" fill="#fff" opacity=".35"/>`,
rocket:`<defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9AA6B8"/><stop offset=".35" stop-color="#FFFFFF"/><stop offset=".7" stop-color="#D4DCE8"/><stop offset="1" stop-color="#6E7A8E"/></linearGradient><linearGradient id="r" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A80A26"/><stop offset=".4" stop-color="#FF4A5E"/><stop offset="1" stop-color="#8A0620"/></linearGradient><radialGradient id="w" cx=".35" cy=".3"><stop offset="0" stop-color="#E0F6FF"/><stop offset=".5" stop-color="#2A9AE8"/><stop offset="1" stop-color="#0A3A7A"/></radialGradient><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6B0"/><stop offset=".4" stop-color="#FFB020"/><stop offset="1" stop-color="#FF4A10" stop-opacity="0"/></linearGradient></defs>
<g transform="rotate(35 50 50)">
<path d="M41 70Q50 104 59 70z" fill="url(#f)"/>
<path d="M38 56 22 78 38 72z" fill="url(#r)"/><path d="M62 56 78 78 62 72z" fill="url(#r)"/>
<path d="M50 6C65 18 67 44 62 72H38C33 44 35 18 50 6z" fill="url(#b)"/>
<path d="M50 6C58 13 62 22 63.5 30H36.5C38 22 42 13 50 6z" fill="url(#r)"/>
<rect x="38" y="66" width="24" height="6" rx="2" fill="#5A6578"/>
<circle cx="50" cy="44" r="8" fill="#B7C2D2"/><circle cx="50" cy="44" r="6" fill="url(#w)"/><circle cx="48" cy="42" r="1.8" fill="#fff" opacity=".8"/>
<path d="M48 76V86" stroke="#7A8698" stroke-width="3"/></g>`,
car:`<defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF6B6B"/><stop offset=".45" stop-color="#E0162E"/><stop offset="1" stop-color="#7A0414"/></linearGradient><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9ED6FF"/><stop offset=".5" stop-color="#1A3550"/><stop offset="1" stop-color="#0A1420"/></linearGradient><radialGradient id="w" cx=".4" cy=".35"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".45" stop-color="#C0C8D4"/><stop offset="1" stop-color="#5A6270"/></radialGradient></defs>
<ellipse cx="52" cy="80" rx="46" ry="4.5" fill="#000" opacity=".3"/>
<path d="M4 64C4 56 10 52 22 50L36 40C44 35 62 34 72 38L86 48C94 50 98 55 98 62V68H4z" fill="url(#b)"/>
<path d="M38 42C46 38 60 37 68 40L78 48 32 50z" fill="url(#g)"/><path d="M54 38.4V49" stroke="#7A0414" stroke-width="2"/>
<path d="M10 58C30 54 70 53 94 56" stroke="#fff" stroke-width="1.6" opacity=".55" fill="none"/>
<path d="M90 54h6v4h-6z" fill="#FFF3B0"/><path d="M4 58h4v4H4z" fill="#FF8A2A"/>
<circle cx="26" cy="68" r="12" fill="#14161A"/><circle cx="26" cy="68" r="7" fill="url(#w)"/><circle cx="26" cy="68" r="2" fill="#333"/>
<circle cx="78" cy="68" r="12" fill="#14161A"/><circle cx="78" cy="68" r="7" fill="url(#w)"/><circle cx="78" cy="68" r="2" fill="#333"/>`,
cake:`<defs><linearGradient id="c" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C77A4A"/><stop offset=".4" stop-color="#F2B07E"/><stop offset="1" stop-color="#9A5430"/></linearGradient><linearGradient id="k" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E8709A"/><stop offset=".4" stop-color="#FFC4D8"/><stop offset="1" stop-color="#C24A78"/></linearGradient><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFBD0"/><stop offset=".5" stop-color="#FFB020"/><stop offset="1" stop-color="#FF5A10"/></linearGradient></defs>
<ellipse cx="50" cy="91" rx="40" ry="6" fill="#E8EEF5"/><ellipse cx="50" cy="90" rx="40" ry="5" fill="#fff"/>
<path d="M16 62V84A34 7 0 0 0 84 84V62z" fill="url(#c)"/>
<ellipse cx="50" cy="62" rx="34" ry="7" fill="url(#k)"/>
<path d="M16 62V70C20 74 22 66 26 72 30 76 32 66 38 70 42 74 46 66 50 72 54 76 58 66 62 70 66 74 70 66 74 72 78 76 80 68 84 70V62z" fill="url(#k)"/>
<path d="M28 40V58A22 5 0 0 0 72 58V40z" fill="url(#k)"/><ellipse cx="50" cy="40" rx="22" ry="5" fill="#FFE0EA"/>
<circle cx="34" cy="62" r="2.5" fill="#D8102E"/><circle cx="50" cy="65" r="2.5" fill="#D8102E"/><circle cx="66" cy="62" r="2.5" fill="#D8102E"/>
<rect x="47" y="22" width="6" height="18" rx="1.5" fill="#6EC6FF"/><path d="M47 26 53 23M47 31 53 28M47 36 53 33" stroke="#fff" stroke-width="1.4"/>
<path d="M50 6C55 12 54 18 50 20 46 18 45 12 50 6z" fill="url(#f)"/>`,
coffee:`<defs><linearGradient id="c" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C9CED6"/><stop offset=".35" stop-color="#FFFFFF"/><stop offset="1" stop-color="#9AA2AE"/></linearGradient><radialGradient id="k" cx=".5" cy=".4"><stop offset="0" stop-color="#C98A52"/><stop offset="1" stop-color="#4A2410"/></radialGradient></defs>
<ellipse cx="50" cy="86" rx="40" ry="8" fill="#B5BCC6"/><ellipse cx="50" cy="84" rx="38" ry="7" fill="#F4F6F9"/>
<path d="M72 48C88 46 88 70 70 70" fill="none" stroke="#D9DEE5" stroke-width="6"/>
<path d="M22 42H78L72 76C70 82 30 82 28 76z" fill="url(#c)"/>
<ellipse cx="50" cy="42" rx="28" ry="7" fill="#E8ECF1"/><ellipse cx="50" cy="43" rx="24" ry="5" fill="url(#k)"/>
<path d="M44 42C46 40 54 40 56 43 52 45 48 45 44 42z" fill="#F4E2C8" opacity=".9"/>
<path d="M40 32C36 24 46 20 42 12M52 30C48 22 58 18 54 8M62 32C60 26 66 22 64 16" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".55"/>`,
champagne:`<defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0A2A18"/><stop offset=".35" stop-color="#2E7A4A"/><stop offset=".55" stop-color="#145232"/><stop offset="1" stop-color="#051A0E"/></linearGradient><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9A6400"/><stop offset=".4" stop-color="#FFE68A"/><stop offset="1" stop-color="#8A5800"/></linearGradient></defs>
<g transform="rotate(-18 50 55)"><ellipse cx="50" cy="95" rx="16" ry="3" fill="#000" opacity=".25"/>
<path d="M44 8H56V30C56 38 66 42 66 54V92C66 95 34 95 34 92V54C34 42 44 38 44 30z" fill="url(#b)"/>
<path d="M43 6H57V34C57 38 60 40 62 42H38C40 40 43 38 43 34z" fill="url(#g)"/>
<rect x="36" y="56" width="28" height="22" rx="2" fill="#F6EED8"/><rect x="36" y="56" width="28" height="4" fill="url(#g)"/><text x="50" y="72" font-size="7" text-anchor="middle" font-family="serif" font-weight="bold" fill="#8A5800">VIP</text>
<path d="M39 46V88" stroke="#fff" stroke-width="2.5" opacity=".3" stroke-linecap="round"/></g>
<circle cx="70" cy="12" r="2" fill="#FFE68A"/><circle cx="76" cy="20" r="1.5" fill="#FFE68A"/><circle cx="66" cy="6" r="1.2" fill="#fff"/>`,
plane:`<defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#E4EDF7"/><stop offset="1" stop-color="#8E9DB2"/></linearGradient><linearGradient id="t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4FA0FF"/><stop offset="1" stop-color="#0B3E8A"/></linearGradient><linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9D4E2"/><stop offset="1" stop-color="#6A7A90"/></linearGradient></defs>
<g transform="rotate(-12 50 50)">
<path d="M44 52 30 82H40L64 54z" fill="url(#w)"/>
<path d="M6 48C6 44 10 42 16 42H80C90 42 98 46 98 50S90 58 80 58H16C10 58 6 54 6 48z" fill="url(#b)"/>
<path d="M8 44 4 20H14L28 43z" fill="url(#t)"/><path d="M6 48 2 46 2 52z" fill="#8E9DB2"/>
<path d="M84 44C88 44 93 46 95 48H86z" fill="#1A3550"/>
<g fill="#2A4A70"><circle cx="34" cy="47" r="1.6"/><circle cx="41" cy="47" r="1.6"/><circle cx="48" cy="47" r="1.6"/><circle cx="55" cy="47" r="1.6"/><circle cx="62" cy="47" r="1.6"/><circle cx="69" cy="47" r="1.6"/><circle cx="76" cy="47" r="1.6"/></g>
<path d="M16 54H80" stroke="url(#t)" stroke-width="2.4"/>
<path d="M46 48 36 30H44L60 47z" fill="url(#w)" opacity=".85"/>
<path d="M16 44H80" stroke="#fff" stroke-width="1.4" opacity=".9"/></g>`
};
// bouquet: reuse rose head
GART.bouquet=`<defs><radialGradient id="p" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#FF7A8C"/><stop offset=".55" stop-color="#D8102E"/><stop offset="1" stop-color="#6E0414"/></radialGradient><linearGradient id="w" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C8902A"/><stop offset=".45" stop-color="#FFF2C6"/><stop offset="1" stop-color="#A8741C"/></linearGradient><linearGradient id="l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7EE07A"/><stop offset="1" stop-color="#1E7A2A"/></linearGradient>
<g id="h"><circle r="11" fill="url(#p)"/><path d="M-6-1C-5-7 5-8 6-2 3-5-2-4-2 1 0-2 4-1 3 2" fill="none" stroke="#6A0214" stroke-width="1.6" stroke-linecap="round"/><path d="M-9 3C-6 9 6 9 9 3 7 11-7 11-9 3z" fill="#FF4A62" opacity=".8"/><ellipse cx="-4" cy="-6" rx="3.5" ry="1.6" fill="#fff" opacity=".35"/></g></defs>
<path d="M24 40 18 26 34 34zM76 40 84 24 68 34zM14 50 6 44 22 44z" fill="url(#l)"/>
<use href="#h" x="30" y="30"/><use href="#h" x="50" y="22"/><use href="#h" x="70" y="30"/><use href="#h" x="22" y="46"/><use href="#h" x="40" y="42"/><use href="#h" x="60" y="42"/><use href="#h" x="78" y="46"/>
<path d="M14 50 50 98 86 50C74 58 60 60 50 60S26 58 14 50z" fill="url(#w)" stroke="#8A5A00" stroke-width="1"/>
<path d="M30 54 50 98" stroke="#fff" stroke-width="1.5" opacity=".5"/>
<path d="M38 74C30 70 28 80 36 80L50 76 64 80C72 80 70 70 62 74L50 76z" fill="#D8102E" stroke="#6E0414" stroke-width=".8"/><circle cx="50" cy="76" r="4" fill="#B00C28"/>`;
GART.goldrose=GART.rose.replace('#FF6B7E','#FFF3B0').replace('#D8102E','#E8B020').replace('#6E0414','#7A4E00').replace('#9E0A22','#B07A00').replace('#4E0210','#5A3800').replace('#FF4A62','#FFE07A').replace('#A80A26','#B8800A').replace('#C40C2A','#D9A21A').replace('#6A0214','#7A4E00');
Object.assign(GART, {
tea: `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".3" stop-color="#fff" stop-opacity=".15"/><stop offset="1" stop-color="#fff" stop-opacity=".45"/></linearGradient><linearGradient id="t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0661A"/><stop offset="1" stop-color="#7A1E04"/></linearGradient><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4F6FA"/><stop offset="1" stop-color="#9AA6B8"/></linearGradient></defs>
<ellipse cx="50" cy="88" rx="38" ry="8" fill="url(#s)"/><ellipse cx="50" cy="86" rx="30" ry="5" fill="#E3E8F0"/><path d="M28 86c0-2 44-2 44 0" stroke="#3A7BD5" stroke-width="2" fill="none"/>
<path d="M33 22H67C66 34 58 40 58 50S68 70 64 84H36C32 70 42 60 42 50S34 34 33 22z" fill="url(#t)"/>
<path d="M33 22H67C66 34 58 40 58 50S68 70 64 84H36C32 70 42 60 42 50S34 34 33 22z" fill="url(#g)" stroke="#fff" stroke-opacity=".7" stroke-width="1.5"/>
<ellipse cx="50" cy="22" rx="17" ry="3.5" fill="#F08A3A" stroke="#fff" stroke-opacity=".8"/>
<path d="M60 14 76 4" stroke="#C9D1DC" stroke-width="3" stroke-linecap="round"/><path d="M60 14 52 30" stroke="#C9D1DC" stroke-width="2.5" stroke-linecap="round"/>
<path d="M44 12C40 6 48 4 44 -2M54 12C50 6 58 4 54 -2" fill="none" stroke="#fff" stroke-width="2" opacity=".5" stroke-linecap="round"/>`,
dallah: `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A5800"/><stop offset=".3" stop-color="#FFE68A"/><stop offset=".55" stop-color="#E3A814"/><stop offset="1" stop-color="#7A4C00"/></linearGradient></defs>
<ellipse cx="48" cy="93" rx="28" ry="4" fill="#000" opacity=".28"/>
<path d="M30 90H66L62 62C60 54 56 50 56 44H40C40 50 36 54 34 62z" fill="url(#g)"/>
<path d="M40 44C38 36 42 30 48 30S58 36 56 44z" fill="url(#g)"/><path d="M44 30C44 22 52 22 52 30" fill="url(#g)"/><circle cx="48" cy="19" r="4" fill="#FFE68A"/>
<path d="M34 64C20 58 14 44 6 40C12 38 22 46 36 56z" fill="url(#g)"/>
<path d="M62 50C80 50 82 76 64 80" fill="none" stroke="#B8800A" stroke-width="5"/>
<path d="M33 70H63M31 80H65" stroke="#7A4C00" stroke-width="1.5" opacity=".6"/><path d="M40 60V86" stroke="#fff" stroke-width="2.5" opacity=".35"/>`,
lantern: `<defs><radialGradient id="l" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".5" stop-color="#FFC93C"/><stop offset="1" stop-color="#E07A10"/></radialGradient><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7A4C00"/><stop offset=".4" stop-color="#FFE68A"/><stop offset="1" stop-color="#7A4C00"/></linearGradient><radialGradient id="h" cx=".5" cy=".5"><stop offset="0" stop-color="#FFD24A" stop-opacity=".55"/><stop offset="1" stop-color="#FFD24A" stop-opacity="0"/></radialGradient></defs>
<circle cx="50" cy="56" r="44" fill="url(#h)"/>
<path d="M50 4V14" stroke="#B8800A" stroke-width="3"/><circle cx="50" cy="6" r="4" fill="none" stroke="#B8800A" stroke-width="2.5"/>
<path d="M36 22H64L58 14H42z" fill="url(#g)"/>
<path d="M34 24H66L72 50 64 78H36L28 50z" fill="url(#l)" stroke="#9A6400" stroke-width="2"/>
<path d="M50 24V78M34 24 40 78M66 24 60 78M28 50H72" stroke="#9A6400" stroke-width="1.6" opacity=".7"/>
<path d="M34 78H66L62 88H38z" fill="url(#g)"/><path d="M44 88H56L54 94H46z" fill="#9A6400"/>`,
palm: `<defs><linearGradient id="t" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6B3E1A"/><stop offset=".5" stop-color="#B07A44"/><stop offset="1" stop-color="#5A3214"/></linearGradient><linearGradient id="l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8EE07A"/><stop offset="1" stop-color="#1E7A2A"/></linearGradient><radialGradient id="d" cx=".35" cy=".3"><stop offset="0" stop-color="#E8873A"/><stop offset="1" stop-color="#6E2A08"/></radialGradient></defs>
<ellipse cx="50" cy="94" rx="26" ry="4" fill="#000" opacity=".25"/>
<path d="M46 94C48 70 46 50 50 32H56C54 52 58 72 58 94z" fill="url(#t)"/>
<path d="M47 84H58M47 74H57M48 64H57M49 54H56M50 44H56" stroke="#4A2810" stroke-width="2"/>
<path d="M52 30C40 18 20 20 8 34 24 28 38 30 52 34z" fill="url(#l)"/><path d="M53 30C64 16 84 16 94 30 78 26 64 28 54 34z" fill="url(#l)"/>
<path d="M52 28C46 12 32 6 22 8 34 12 44 20 50 32z" fill="url(#l)"/><path d="M54 28C60 12 74 6 84 10 72 12 62 20 56 32z" fill="url(#l)"/>
<path d="M52 32C40 34 28 46 26 60 36 48 44 40 54 36z" fill="url(#l)"/><path d="M54 32C66 34 78 46 80 60 70 48 62 40 52 36z" fill="url(#l)"/>
<g fill="url(#d)"><circle cx="46" cy="40" r="4"/><circle cx="52" cy="42" r="4"/><circle cx="58" cy="40" r="4"/><circle cx="49" cy="46" r="3.5"/><circle cx="55" cy="46" r="3.5"/></g>`,
star: `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF6C2"/><stop offset=".4" stop-color="#FFD23F"/><stop offset="1" stop-color="#C77A00"/></linearGradient></defs>
<ellipse cx="50" cy="94" rx="26" ry="4" fill="#000" opacity=".25"/>
<path d="M50 6 62 34 92 37 69 57 76 87 50 71 24 87 31 57 8 37 38 34z" fill="url(#g)" stroke="#A86200" stroke-width="2" stroke-linejoin="round"/>
<path d="M50 6 50 71M8 37 69 57M92 37 31 57" stroke="#C77A00" stroke-width="1" opacity=".35"/>
<path d="M50 14 58 34 44 36z" fill="#fff" opacity=".55"/>`,
moon: `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF6C2"/><stop offset=".45" stop-color="#FFD23F"/><stop offset="1" stop-color="#B8700A"/></linearGradient></defs>
<ellipse cx="46" cy="94" rx="24" ry="4" fill="#000" opacity=".22"/>
<path d="M58 10C36 12 20 30 20 52S38 90 60 90C46 84 36 70 36 50S46 16 58 10z" fill="url(#g)" stroke="#A86200" stroke-width="2"/>
<path d="M30 40C30 30 38 20 48 16" stroke="#fff" stroke-width="3" fill="none" opacity=".6" stroke-linecap="round"/>
<path d="M74 30l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="url(#g)"/>`,
teddy: `<defs><radialGradient id="b" cx=".4" cy=".3"><stop offset="0" stop-color="#D9A06A"/><stop offset=".6" stop-color="#A0642E"/><stop offset="1" stop-color="#5E3410"/></radialGradient><radialGradient id="m" cx=".4" cy=".35"><stop offset="0" stop-color="#F6DCC0"/><stop offset="1" stop-color="#C79A6B"/></radialGradient></defs>
<ellipse cx="50" cy="94" rx="30" ry="4" fill="#000" opacity=".25"/>
<ellipse cx="50" cy="70" rx="26" ry="22" fill="url(#b)"/><ellipse cx="50" cy="72" rx="14" ry="12" fill="url(#m)"/>
<circle cx="26" cy="84" r="9" fill="url(#b)"/><circle cx="74" cy="84" r="9" fill="url(#b)"/><circle cx="24" cy="62" r="8" fill="url(#b)"/><circle cx="76" cy="62" r="8" fill="url(#b)"/>
<circle cx="28" cy="18" r="10" fill="url(#b)"/><circle cx="72" cy="18" r="10" fill="url(#b)"/><circle cx="28" cy="18" r="5" fill="#C79A6B"/><circle cx="72" cy="18" r="5" fill="#C79A6B"/>
<circle cx="50" cy="34" r="24" fill="url(#b)"/><ellipse cx="50" cy="42" rx="11" ry="8" fill="url(#m)"/>
<ellipse cx="50" cy="38" rx="4" ry="3" fill="#2A1404"/><path d="M50 41V45M46 46Q50 49 54 46" stroke="#2A1404" stroke-width="1.6" fill="none"/>
<circle cx="41" cy="29" r="3" fill="#1A0A02"/><circle cx="59" cy="29" r="3" fill="#1A0A02"/><circle cx="42" cy="28" r="1" fill="#fff"/><circle cx="60" cy="28" r="1" fill="#fff"/>
<path d="M40 54 50 60 60 54 58 64 50 60 42 64z" fill="#E8304C"/><circle cx="50" cy="60" r="3" fill="#B00C28"/>`,
icecream: `<defs><linearGradient id="c" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B8742E"/><stop offset=".5" stop-color="#F2B66B"/><stop offset="1" stop-color="#9A5A1E"/></linearGradient><radialGradient id="p" cx=".35" cy=".3"><stop offset="0" stop-color="#FFE0EC"/><stop offset="1" stop-color="#F06292"/></radialGradient><radialGradient id="v" cx=".35" cy=".3"><stop offset="0" stop-color="#FFFBEA"/><stop offset="1" stop-color="#F2D98A"/></radialGradient><radialGradient id="h" cx=".35" cy=".3"><stop offset="0" stop-color="#B07850"/><stop offset="1" stop-color="#4A2410"/></radialGradient></defs>
<path d="M30 50 50 96 70 50z" fill="url(#c)"/><path d="M34 58 62 58M38 68 58 68M42 78 56 78M36 54 54 90M64 54 46 90" stroke="#8A4E14" stroke-width="1.4" opacity=".6"/>
<circle cx="38" cy="44" r="14" fill="url(#v)"/><circle cx="62" cy="44" r="14" fill="url(#h)"/><circle cx="50" cy="26" r="15" fill="url(#p)"/>
<circle cx="50" cy="10" r="5" fill="#E8304C"/><path d="M50 6C52 2 56 0 58 1" stroke="#2E8B3A" stroke-width="1.6" fill="none"/>
<g fill="#fff" opacity=".9"><rect x="40" y="22" width="5" height="2" rx="1" transform="rotate(30 42 23)" fill="#38BDF8"/><rect x="54" y="20" width="5" height="2" rx="1" transform="rotate(-20 56 21)" fill="#4ADE80"/><rect x="48" y="32" width="5" height="2" rx="1" fill="#FFD24A"/></g>`,
lollipop: `<defs><radialGradient id="h" cx=".35" cy=".3"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
<path d="M50 60V96" stroke="#E8ECF2" stroke-width="5" stroke-linecap="round"/>
<circle cx="50" cy="36" r="30" fill="#FF5A8A"/>
<path d="M50 36m0-4a4 4 0 1 1-4 4 8 8 0 0 1 8-8 12 12 0 0 1 12 12 16 16 0 0 1-16 16 20 20 0 0 1-20-20 24 24 0 0 1 24-24" fill="none" stroke="#fff" stroke-width="5"/>
<path d="M50 36m0-4a4 4 0 1 1-4 4 8 8 0 0 1 8-8 12 12 0 0 1 12 12 16 16 0 0 1-16 16 20 20 0 0 1-20-20 24 24 0 0 1 24-24" fill="none" stroke="#FFD24A" stroke-width="2.5" transform="rotate(40 50 36)"/>
<circle cx="50" cy="36" r="30" fill="url(#h)"/>
<path d="M44 62 50 66 56 62 58 70 50 66 42 70z" fill="#38BDF8"/>`,
lips: `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF5A7A"/><stop offset="1" stop-color="#9E0A2E"/></linearGradient></defs>
<path d="M8 50C20 30 36 26 50 38 64 26 80 30 92 50 78 52 64 50 50 54 36 50 22 52 8 50z" fill="url(#g)"/>
<path d="M8 50C22 54 36 54 50 56 64 54 78 54 92 50 80 76 64 84 50 84S20 76 8 50z" fill="url(#g)"/>
<path d="M8 50C24 56 76 56 92 50" stroke="#6E0418" stroke-width="2.5" fill="none"/>
<path d="M30 66C38 72 50 74 58 72" stroke="#fff" stroke-width="3.5" opacity=".55" fill="none" stroke-linecap="round"/><ellipse cx="34" cy="40" rx="6" ry="2.5" fill="#fff" opacity=".5" transform="rotate(-20 34 40)"/>
<path d="M80 14c3-6 11-4 10 2-1 4-6 7-10 10-4-3-9-6-10-10-1-6 7-8 10-2z" fill="#FF5A7A"/>`,
perfume: `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C2185B"/><stop offset=".35" stop-color="#FF8AB8"/><stop offset=".6" stop-color="#F06292"/><stop offset="1" stop-color="#880E4F"/></linearGradient><linearGradient id="c" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A5800"/><stop offset=".45" stop-color="#FFE68A"/><stop offset="1" stop-color="#8A5800"/></linearGradient></defs>
<ellipse cx="50" cy="94" rx="26" ry="4" fill="#000" opacity=".25"/>
<rect x="42" y="14" width="16" height="16" rx="3" fill="url(#c)"/><rect x="44" y="28" width="12" height="8" fill="#C8902A"/>
<path d="M24 52C24 40 34 36 50 36S76 40 76 52V84C76 90 70 92 50 92S24 90 24 84z" fill="url(#g)" opacity=".92"/>
<path d="M30 48V84" stroke="#fff" stroke-width="4" opacity=".45" stroke-linecap="round"/>
<rect x="36" y="58" width="28" height="16" rx="3" fill="#FFF0F6" opacity=".9"/><text x="50" y="70" font-size="9" text-anchor="middle" font-family="serif" font-weight="bold" fill="#880E4F">عطر</text>
<path d="M60 18C68 12 76 14 82 8" stroke="#FFB6D0" stroke-width="2" fill="none" stroke-dasharray="2 3"/>`,
watch: `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF4C4"/><stop offset=".4" stop-color="#E3A814"/><stop offset="1" stop-color="#7A4C00"/></linearGradient><radialGradient id="f" cx=".4" cy=".35"><stop offset="0" stop-color="#2A3A5A"/><stop offset="1" stop-color="#0A1020"/></radialGradient></defs>
<path d="M36 4H64L60 30H40zM36 96H64L60 70H40z" fill="url(#g)"/><path d="M40 10H60M40 18H60M40 82H60M40 90H60" stroke="#8A5800" stroke-width="1.5" opacity=".6"/>
<circle cx="50" cy="50" r="27" fill="url(#g)"/><circle cx="50" cy="50" r="21" fill="url(#f)"/><rect x="76" y="46" width="6" height="8" rx="2" fill="#C8902A"/>
<g stroke="#FFE68A" stroke-width="2"><path d="M50 32V36M50 64V68M32 50H36M64 50H68"/></g>
<path d="M50 50V38M50 50 59 55" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="50" cy="50" r="2.5" fill="#FFD24A"/>
<path d="M36 40C40 34 46 31 52 31" stroke="#fff" stroke-width="2" opacity=".4" fill="none"/>`,
moneybag: `<defs><radialGradient id="b" cx=".4" cy=".35"><stop offset="0" stop-color="#E9D29A"/><stop offset=".6" stop-color="#B8945A"/><stop offset="1" stop-color="#6E5228"/></radialGradient><radialGradient id="c" cx=".35" cy=".3"><stop offset="0" stop-color="#FFF6C2"/><stop offset=".5" stop-color="#FFC928"/><stop offset="1" stop-color="#A86E00"/></radialGradient></defs>
<ellipse cx="50" cy="94" rx="34" ry="4" fill="#000" opacity=".25"/>
<path d="M40 30C30 24 32 12 40 16 44 8 56 8 60 16 68 12 70 24 60 30z" fill="url(#b)"/>
<path d="M38 32H62C82 44 90 66 82 84 76 92 24 92 18 84 10 66 18 44 38 32z" fill="url(#b)"/>
<path d="M36 30H64" stroke="#8A6A2A" stroke-width="5" stroke-linecap="round"/>
<circle cx="50" cy="64" r="15" fill="url(#c)" stroke="#A86E00" stroke-width="1.5"/><text x="50" y="70" font-size="16" text-anchor="middle" font-weight="900" font-family="sans-serif" fill="#7A4C00">$</text>
<ellipse cx="22" cy="88" rx="9" ry="4" fill="url(#c)"/><ellipse cx="80" cy="90" rx="9" ry="4" fill="url(#c)"/><ellipse cx="78" cy="86" rx="9" ry="4" fill="url(#c)"/>`,
goldbar: `<defs><linearGradient id="t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6C2"/><stop offset="1" stop-color="#FFC928"/></linearGradient><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E3A814"/><stop offset="1" stop-color="#8A5800"/></linearGradient></defs>
<ellipse cx="50" cy="94" rx="40" ry="4" fill="#000" opacity=".28"/>
<g id="bar"><path d="M10 78 20 66H48L56 78z" fill="url(#t)"/><path d="M10 78H56V90H10z" fill="url(#f)"/><path d="M56 78 48 66V78z" fill="#B8800A"/></g>
<use href="#bar" x="40"/><use href="#bar" x="20" y="-24"/>
<path d="M30 46H58M50 70H78M10 70H38" stroke="#fff" stroke-width="2" opacity=".6"/>
<path d="M84 18l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#fff"/><path d="M16 30l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#FFE68A"/>`,
mic: `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A5800"/><stop offset=".35" stop-color="#FFE68A"/><stop offset=".6" stop-color="#E3A814"/><stop offset="1" stop-color="#7A4C00"/></linearGradient><radialGradient id="h" cx=".35" cy=".3"><stop offset="0" stop-color="#FFF6C2"/><stop offset=".55" stop-color="#C8902A"/><stop offset="1" stop-color="#5A3800"/></radialGradient><pattern id="m" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="1" fill="#5A3800" opacity=".55"/></pattern></defs>
<ellipse cx="50" cy="94" rx="20" ry="3.5" fill="#000" opacity=".25"/>
<path d="M42 54H58L55 90H45z" fill="url(#g)"/><rect x="40" y="50" width="20" height="8" rx="2" fill="#7A4C00"/>
<circle cx="50" cy="30" r="24" fill="url(#h)"/><circle cx="50" cy="30" r="24" fill="url(#m)"/>
<path d="M27 30H73" stroke="#7A4C00" stroke-width="3"/><path d="M34 16C38 10 44 8 50 8" stroke="#fff" stroke-width="3" fill="none" opacity=".6" stroke-linecap="round"/>
<path d="M80 18C86 24 86 36 80 42M86 12C95 22 95 38 86 48" stroke="#FFD24A" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>`,
oud: `<defs><radialGradient id="b" cx=".4" cy=".35"><stop offset="0" stop-color="#E0A060"/><stop offset=".6" stop-color="#9A5420"/><stop offset="1" stop-color="#4A2408"/></radialGradient><linearGradient id="n" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3A1C08"/><stop offset=".5" stop-color="#6E3A14"/><stop offset="1" stop-color="#2A1404"/></linearGradient></defs>
<g transform="rotate(-35 50 50)"><ellipse cx="50" cy="94" rx="20" ry="3" fill="#000" opacity=".2"/>
<path d="M46 8H54V40H46z" fill="url(#n)"/><path d="M44 4H56L58 12H42z" fill="#2A1404"/><g fill="#E8D8B0"><circle cx="42" cy="8" r="2"/><circle cx="58" cy="8" r="2"/></g>
<ellipse cx="50" cy="66" rx="28" ry="30" fill="url(#b)"/><path d="M30 50C36 40 64 40 70 50" stroke="#F2C890" stroke-width="2" fill="none" opacity=".6"/>
<circle cx="50" cy="60" r="7" fill="#2A1404"/><circle cx="50" cy="60" r="7" fill="none" stroke="#E8D8B0" stroke-width="1.5"/>
<rect x="40" y="82" width="20" height="4" rx="2" fill="#2A1404"/><path d="M48 12V84M52 12V84" stroke="#F4F0E6" stroke-width=".8"/></g>`,
fireworks: `<g stroke-linecap="round" stroke-width="3.5">
<g stroke="#FFD24A" transform="translate(36 38)"><path d="M0-30V-12M0 30V12M-30 0H-12M30 0H12M-21-21-9-9M21 21 9 9M-21 21-9 9M21-21 9-9"/></g>
<g stroke="#FF5A8A" transform="translate(70 30) scale(.7)"><path d="M0-30V-12M0 30V12M-30 0H-12M30 0H12M-21-21-9-9M21 21 9 9M-21 21-9 9M21-21 9-9"/></g>
<g stroke="#38BDF8" transform="translate(66 70) scale(.8)"><path d="M0-30V-12M0 30V12M-30 0H-12M30 0H12M-21-21-9-9M21 21 9 9M-21 21-9 9M21-21 9-9"/></g></g>
<g fill="#fff"><circle cx="36" cy="38" r="4"/><circle cx="70" cy="30" r="3"/><circle cx="66" cy="70" r="3.5"/></g>
<g fill="#FFE68A"><circle cx="14" cy="70" r="2"/><circle cx="24" cy="84" r="1.5"/><circle cx="88" cy="50" r="2"/><circle cx="50" cy="8" r="1.5"/></g>`,
yacht: `<defs><linearGradient id="h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#B8C4D4"/></linearGradient><linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38BDF8"/><stop offset="1" stop-color="#0A4A8A"/></linearGradient><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9ED6FF"/><stop offset="1" stop-color="#14304E"/></linearGradient></defs>
<path d="M0 78C12 72 22 84 34 78S56 72 68 78 88 84 100 78V100H0z" fill="url(#w)"/>
<path d="M4 64H92L80 80H16z" fill="url(#h)"/><path d="M4 64H92L90 68H6z" fill="#1A3550"/>
<path d="M20 64 28 50H72L84 64z" fill="url(#h)"/><path d="M30 52H70L78 62H24z" fill="url(#g)"/>
<path d="M36 50 42 40H64L68 50z" fill="url(#h)"/><path d="M44 42H62L65 48H40z" fill="url(#g)"/>
<path d="M54 40V22" stroke="#9AA6B8" stroke-width="2"/><path d="M54 22 70 28 54 32z" fill="#E8304C"/>
<path d="M10 82C30 86 60 86 86 82" stroke="#fff" stroke-width="2" opacity=".6" fill="none"/>`,
castle: `<defs><linearGradient id="w" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E8D9B8"/><stop offset=".5" stop-color="#FFF8E6"/><stop offset="1" stop-color="#C8B48A"/></linearGradient><linearGradient id="d" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE68A"/><stop offset=".5" stop-color="#E3A814"/><stop offset="1" stop-color="#8A5800"/></linearGradient><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5ED0E8"/><stop offset="1" stop-color="#0E6E8A"/></linearGradient></defs>
<ellipse cx="50" cy="95" rx="46" ry="4" fill="#000" opacity=".28"/>
<rect x="6" y="40" width="12" height="54" fill="url(#w)"/><path d="M4 40C4 30 12 24 12 18 12 24 20 30 20 40z" fill="url(#b)"/><path d="M12 14V18" stroke="#E3A814" stroke-width="2"/>
<rect x="82" y="40" width="12" height="54" fill="url(#w)"/><path d="M80 40C80 30 88 24 88 18 88 24 96 30 96 40z" fill="url(#b)"/><path d="M88 14V18" stroke="#E3A814" stroke-width="2"/>
<rect x="18" y="52" width="64" height="42" fill="url(#w)"/>
<path d="M28 52C28 30 40 22 50 14 60 22 72 30 72 52z" fill="url(#d)"/><path d="M50 6V14" stroke="#E3A814" stroke-width="2.5"/><path d="M50 4a3 3 0 1 0 0.1 0" fill="#FFE68A"/>
<path d="M36 40C38 30 44 24 50 20" stroke="#fff" stroke-width="2.5" opacity=".55" fill="none"/>
<path d="M42 94V76C42 70 58 70 58 76V94z" fill="#7A4C00"/><path d="M26 66C26 60 34 60 34 66V74H26zM66 66C66 60 74 60 74 66V74H66z" fill="url(#b)"/>
<path d="M18 52H82" stroke="#C8B48A" stroke-width="2"/><path d="M9 56H15M85 56H91M9 70H15M85 70H91" stroke="url(#b)" stroke-width="4"/>`
});

function gartURI(k,vb){return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+(vb||'0 0 100 100')+'">'+GART[k]+'</svg>')}
