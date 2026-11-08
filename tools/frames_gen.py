import math, json
C=200; RA=134  # avatar radius in a 400 canvas (frame = 1.5x avatar)
def P(a,r,cx=C,cy=C): a=math.radians(a-90); return cx+r*math.cos(a), cy+r*math.sin(a)
DEFS='''
<linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6C4"/><stop offset=".22" stop-color="#F7CF4F"/><stop offset=".5" stop-color="#A86F0C"/><stop offset=".72" stop-color="#FFE07A"/><stop offset="1" stop-color="#7A4A00"/></linearGradient>
<linearGradient id="gold2" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#6E4200"/><stop offset=".35" stop-color="#E8B43A"/><stop offset=".55" stop-color="#FFF4C0"/><stop offset=".75" stop-color="#D9A030"/><stop offset="1" stop-color="#7A4A00"/></linearGradient>
<radialGradient id="goldR" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#FFF6C4"/><stop offset=".45" stop-color="#F2C040"/><stop offset="1" stop-color="#8A5600"/></radialGradient>
<linearGradient id="silver" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".25" stop-color="#C9D2DC"/><stop offset=".5" stop-color="#6F7A86"/><stop offset=".72" stop-color="#E9EEF3"/><stop offset="1" stop-color="#4A5560"/></linearGradient>
<linearGradient id="bronze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD9B0"/><stop offset=".25" stop-color="#D08A4E"/><stop offset=".5" stop-color="#6E3A12"/><stop offset=".72" stop-color="#E9A56A"/><stop offset="1" stop-color="#4A2408"/></linearGradient>
<linearGradient id="rosegold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE4E1"/><stop offset=".25" stop-color="#F2A7A0"/><stop offset=".5" stop-color="#A4504A"/><stop offset=".72" stop-color="#FFC9C2"/><stop offset="1" stop-color="#6A2A26"/></linearGradient>
<linearGradient id="ice" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".35" stop-color="#9FE6FF"/><stop offset=".6" stop-color="#2E8FD6"/><stop offset=".8" stop-color="#C8F2FF"/><stop offset="1" stop-color="#1A4E9A"/></linearGradient>
<linearGradient id="purp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3D9FF"/><stop offset=".25" stop-color="#B46CF0"/><stop offset=".5" stop-color="#4A157A"/><stop offset=".72" stop-color="#D9A6FF"/><stop offset="1" stop-color="#2A0848"/></linearGradient>
<linearGradient id="feather" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#F1F4FA"/><stop offset="1" stop-color="#B9C3D6"/></linearGradient>
<linearGradient id="featherG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFF8DC"/><stop offset=".6" stop-color="#FFE38A"/><stop offset="1" stop-color="#C08A1E"/></linearGradient>
<radialGradient id="flame" cx=".5" cy=".85" r=".9"><stop offset="0" stop-color="#FFFBD0"/><stop offset=".25" stop-color="#FFD23A"/><stop offset=".6" stop-color="#FF6A00"/><stop offset="1" stop-color="#B3120A"/></radialGradient>
<radialGradient id="flameB" cx=".5" cy=".85" r=".9"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".3" stop-color="#9FF0FF"/><stop offset=".65" stop-color="#2C7BFF"/><stop offset="1" stop-color="#3A0FA8"/></radialGradient>
<radialGradient id="rose" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#7A0020"/><stop offset=".5" stop-color="#D81B50"/><stop offset="1" stop-color="#FF7A9C"/></radialGradient>
<linearGradient id="leaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9BE37A"/><stop offset=".5" stop-color="#2E8B3A"/><stop offset="1" stop-color="#0E4A1E"/></linearGradient>
<radialGradient id="pearl" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".5" stop-color="#F3ECF7"/><stop offset="1" stop-color="#A99BB8"/></radialGradient>

<linearGradient id="iron" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9AA0A8"/><stop offset=".25" stop-color="#3A3F46"/><stop offset=".5" stop-color="#0E1014"/><stop offset=".72" stop-color="#5A616B"/><stop offset="1" stop-color="#050607"/></linearGradient>
<linearGradient id="blood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF5A5A"/><stop offset=".3" stop-color="#B00010"/><stop offset=".6" stop-color="#4A0006"/><stop offset=".8" stop-color="#C21020"/><stop offset="1" stop-color="#2A0003"/></linearGradient>
<radialGradient id="bone" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#FFFFF4"/><stop offset=".55" stop-color="#E4DCC2"/><stop offset="1" stop-color="#8A7F62"/></radialGradient>
<radialGradient id="flameG" cx=".5" cy=".85" r=".9"><stop offset="0" stop-color="#F4FFD0"/><stop offset=".3" stop-color="#8CFF3A"/><stop offset=".65" stop-color="#18A82A"/><stop offset="1" stop-color="#03300A"/></radialGradient>
<radialGradient id="flameP" cx=".5" cy=".85" r=".9"><stop offset="0" stop-color="#FFE0FF"/><stop offset=".3" stop-color="#C04CFF"/><stop offset=".65" stop-color="#5A0FA8"/><stop offset="1" stop-color="#14002A"/></radialGradient>
<radialGradient id="flameD" cx=".5" cy=".85" r=".9"><stop offset="0" stop-color="#FFD0A0"/><stop offset=".3" stop-color="#FF2A00"/><stop offset=".65" stop-color="#7A0000"/><stop offset="1" stop-color="#120000"/></radialGradient>
<linearGradient id="horn" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#1A0505"/><stop offset=".5" stop-color="#5A1010"/><stop offset=".8" stop-color="#C8B89A"/><stop offset="1" stop-color="#FFF6E0"/></linearGradient>
<linearGradient id="batw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7A3A8A"/><stop offset=".5" stop-color="#3A1248"/><stop offset="1" stop-color="#14041C"/></linearGradient><linearGradient id="batr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C83A3A"/><stop offset=".5" stop-color="#5A0A12"/><stop offset="1" stop-color="#1A0004"/></linearGradient><filter id="rim" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#FF3A6A" flood-opacity=".8"/></filter>
<radialGradient id="velvet" cx=".5" cy=".5" r=".6"><stop offset=".6" stop-color="#9A0A1E"/><stop offset="1" stop-color="#3A0008"/></radialGradient>
<linearGradient id="plat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".3" stop-color="#DDE8F2"/><stop offset=".5" stop-color="#8FA3B8"/><stop offset=".7" stop-color="#F4FAFF"/><stop offset="1" stop-color="#5E7086"/></linearGradient>
<linearGradient id="turq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8FFF4"/><stop offset=".4" stop-color="#1AC8B4"/><stop offset="1" stop-color="#05524A"/></linearGradient>
<filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="2.2" flood-color="#000" flood-opacity=".55"/></filter>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
'''
GEMS={'blood':('#2A0003','#C8001A','#FF7070'),'toxic':('#03300A','#2AD43A','#C8FFB0'),'turq':('#05524A','#1AC8B4','#B8FFF4'),'ruby':('#5A0010','#D6163E','#FF8AA0'),'sapph':('#081A5A','#1E5BEA','#8EC5FF'),'emer':('#033A1A','#0FA34E','#8BF5B4'),'amet':('#2A0848','#9A3BE0','#E2B4FF'),'dia':('#5E7C9A','#D6F1FF','#FFFFFF'),'topaz':('#6A3A00','#FFAA1A','#FFE7A0')}
def gem(cx,cy,r,k,n=8):
    d,m,l=GEMS[k]; o=[];
    pts=[P(i*360/n+180/n,r,cx,cy) for i in range(n)]; tab=[P(i*360/n+180/n,r*.55,cx,cy) for i in range(n)]
    o.append('<polygon points="%s" fill="%s" stroke="url(#gold)" stroke-width="%.1f"/>'%(' '.join('%.1f,%.1f'%p for p in pts),d,max(1.2,r*.18)))
    for i in range(n):
        a,b=pts[i],pts[(i+1)%n]; c,e=tab[i],tab[(i+1)%n]
        col=[l,m,d,m][i%4] if k!='dia' else ['#FFFFFF','#BFE6FF','#7FA9CC','#E6F7FF'][i%4]
        o.append('<polygon points="%.1f,%.1f %.1f,%.1f %.1f,%.1f %.1f,%.1f" fill="%s" opacity=".95"/>'%(*(a+b+e+c),col))
    o.append('<polygon points="%s" fill="%s"/>'%(' '.join('%.1f,%.1f'%p for p in tab),m))
    o.append('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="#fff" opacity=".85" transform="rotate(-30 %.1f %.1f)"/>'%(cx-r*.25,cy-r*.3,r*.22,r*.1,cx-r*.25,cy-r*.3))
    return '<g filter="url(#sh)">'+''.join(o)+'</g>'
def ring(r1,r2,g='gold',edge='#FFF6C4',dark='#4A2A00'):
    w=r2-r1; rm=(r1+r2)/2
    return ('<circle cx="200" cy="200" r="%.1f" fill="none" stroke="url(#%s)" stroke-width="%.1f" filter="url(#sh)"/>'%(rm,g,w)+
            '<circle cx="200" cy="200" r="%.1f" fill="none" stroke="%s" stroke-width="1.6" opacity=".9"/>'%(r2-.8,edge)+
            '<circle cx="200" cy="200" r="%.1f" fill="none" stroke="%s" stroke-width="1.6" opacity=".7"/>'%(r1+.8,dark))
def beads(r,n,rad,fill='url(#goldR)'):
    return ''.join('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="%s" stroke="#5A3600" stroke-width=".6"/>'%(*P(i*360/n,r),rad,fill) for i in range(n))
def notches(r,n,g='#5A3600'):
    return ''.join('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="1.4" opacity=".6"/>'%(*P(i*360/n,r-5),*P(i*360/n,r+5),g) for i in range(n))
def scroll(a,r,s=1,g='gold',flip=False):
    x,y=P(a,r); f=-1 if flip else 1
    path='M0,0 C %d,-22 %d,-30 %d,-14 C %d,-4 %d,-6 %d,-14 C %d,-20 %d,-18 %d,-12'%(8*f,26*f,34*f,30*f,22*f,22*f,24*f,28*f,30*f)
    return '<path d="%s" fill="none" stroke="url(#%s)" stroke-width="4.5" stroke-linecap="round" transform="translate(%.1f %.1f) rotate(%.1f) scale(%.2f)" filter="url(#sh)"/>'%(path,g,x,y,a,s)
def leafarc(a0,a1,r,n,g='url(#gold)',sz=12):
    o=[]
    for i in range(n):
        a=a0+(a1-a0)*i/(n-1); x,y=P(a,r); dirn=1 if a1>a0 else -1
        for side in (-1,1):
            o.append('<ellipse cx="0" cy="%.1f" rx="%.1f" ry="%.1f" fill="%s" stroke="#5A3600" stroke-width=".7" transform="translate(%.1f %.1f) rotate(%.1f) rotate(%d)"/>'%(-sz*.6,sz*.38,sz*.75,g,x,y,a+90*dirn,side*40))
    return '<g filter="url(#sh)">'+''.join(o)+'</g>'
def crown(cx,cy,w,gemk='ruby'):
    h=w*.62; x0=cx-w/2
    pts=[(0,1),(0,.38),(.18,.62),(.32,.1),(.5,.5),(.68,.1),(.82,.62),(1,.38),(1,1)]
    d='M'+' L'.join('%.1f,%.1f'%(x0+px*w,cy-h+py*h) for px,py in pts)+'Z'
    o=['<path d="%s" fill="url(#gold)" stroke="#5A3600" stroke-width="1.5" stroke-linejoin="round"/>'%d,
       '<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="3" fill="url(#gold2)" stroke="#5A3600" stroke-width="1.2"/>'%(x0-2,cy-h*.12,w+4,h*.24)]
    for px,py in [(0,.38),(.32,.1),(.5,.5),(.68,.1),(1,.38)]:
        o.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="url(#pearl)" stroke="#8a7a90" stroke-width=".6"/>'%(x0+px*w,cy-h+py*h-w*.04,w*.055))
    s=''.join(o)+gem(cx,cy-h*.38,w*.12,gemk)+gem(x0+w*.2,cy,w*.06,'sapph',6)+gem(x0+w*.8,cy,w*.06,'sapph',6)+gem(cx,cy,w*.07,'emer',6)
    return '<g filter="url(#sh)">'+s+'</g>'
def wing(side,g='feather',edge='#C9A24A',scale=1):
    # base near (C±RA*.7, C-20), fans outward
    o=[]; bx=200+side*112; by=196
    rows=[(10,190,30,-78,0),(9,135,26,-66,0),(8,85,22,-54,0)]
    for n,L,wd,start,step in rows:
        for i in range(n):
            ang=start+i*(118/n)
            Li=L*(1-i*0.06)
            tr='translate(%.1f %.1f) scale(%d 1) rotate(%.1f)'%(bx,by,side,ang)
            path='M0,0 C %.1f,-%.1f %.1f,-%.1f %.1f,-%.1f C %.1f,%.1f %.1f,%.1f 0,0Z'%(Li*.25,wd*.7,Li*.75,wd*.75,Li,wd*.05,Li*.85,wd*.5,Li*.3,wd*.45)
            o.append('<path d="%s" fill="url(#%s)" stroke="%s" stroke-width="1" transform="%s"/>'%(path,g,edge,tr))
            o.append('<path d="M2,0 L%.1f,-1" stroke="%s" stroke-width=".8" opacity=".6" transform="%s"/>'%(Li*.9,edge,tr))
    return '<g filter="url(#sh)" transform="translate(200 200) scale(%.2f) translate(-200 -200)">'%scale+''.join(reversed(o))+'</g>'
def flames(n,r,g='flame',big=1):
    o=[]
    for i in range(n):
        a=i*360/n; up=math.cos(math.radians(a))  # bigger on top
        L=(26+ (14 if i%2 else 0))*big*(1+.35*max(0,-up)); x,y=P(a,r)
        path='M-%.1f,0 C -%.1f,-%.1f -2,-%.1f 0,-%.1f C 3,-%.1f %.1f,-%.1f %.1f,0Z'%(L*.32,L*.4,L*.5,L*.8,L,L*.75,L*.42,L*.45,L*.32)
        o.append('<path d="%s" fill="url(#%s)" transform="translate(%.1f %.1f) rotate(%.1f)" opacity=".95"/>'%(path,g,x,y,a))
    return '<g>'+''.join(o)+'</g>'
def shards(n,r,L):
    o=[]
    for i in range(n):
        a=i*360/n+ (6 if i%2 else 0); Li=L*(1.5 if i%3==0 else 1); x,y=P(a,r)
        o.append('<polygon points="-7,0 0,-%.1f 7,0" fill="url(#ice)" stroke="#E6FBFF" stroke-width="1" transform="translate(%.1f %.1f) rotate(%.1f)"/>'%(Li,x,y,a))
    return '<g filter="url(#sh)">'+''.join(o)+'</g>'
def rosef(cx,cy,r):
    o=['<circle cx="%.1f" cy="%.1f" r="%.1f" fill="url(#rose)"/>'%(cx,cy,r)]
    for k,(rr,n) in enumerate([(r*.95,6),(r*.7,5),(r*.45,4)]):
        for i in range(n):
            a=i*360/n+k*25; x,y=P(a,rr*.45,cx,cy)
            o.append('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="%s" stroke="#7A0020" stroke-width=".8" transform="rotate(%.1f %.1f %.1f)"/>'%(x,y,rr*.55,rr*.4,['#FF6F91','#E9285A','#B5103E'][k],a,x,y))
    o.append('<path d="M%.1f,%.1f q%.1f,-%.1f %.1f,0 q-%.1f,%.1f -%.1f,0" fill="none" stroke="#5A0016" stroke-width="1.4"/>'%(cx-r*.2,cy,r*.2,r*.25,r*.4,r*.2,r*.25,r*.4))
    return '<g filter="url(#sh)">'+''.join(o)+'</g>'
def leaf(cx,cy,a,s):
    return '<path d="M0,0 C 8,-10 22,-10 30,0 C 22,10 8,10 0,0Z" fill="url(#leaf)" stroke="#0E4A1E" stroke-width=".8" transform="translate(%.1f %.1f) rotate(%.1f) scale(%.2f)" filter="url(#sh)"/>'%(cx,cy,a,s)
def star8(cx,cy,r,fill='url(#gold)'):
    pts=[]
    for i in range(16):
        rr=r if i%2==0 else r*.62; pts.append(P(i*22.5,rr,cx,cy))
    return '<polygon points="%s" fill="%s" stroke="#5A3600" stroke-width="1" filter="url(#sh)"/>'%(' '.join('%.1f,%.1f'%p for p in pts),fill)
def sparkle(cx,cy,r,col='#FFFFFF'):
    return '<path d="M%.1f,%.1f Q%.1f,%.1f %.1f,%.1f Q%.1f,%.1f %.1f,%.1f Q%.1f,%.1f %.1f,%.1f Q%.1f,%.1f %.1f,%.1f Z" fill="%s"/>'%(cx,cy-r,cx,cy,cx+r,cy,cx,cy,cx,cy+r,cx,cy,cx-r,cy,cx,cy,cx,cy-r,col)
def heart(cx,cy,s,fill='url(#rose)'):
    return '<path d="M0,6 C -14,-6 -8,-18 0,-10 C 8,-18 14,-6 0,6Z" fill="%s" stroke="url(#gold)" stroke-width="1.6" transform="translate(%.1f %.1f) scale(%.2f)" filter="url(#sh)"/>'%(fill,cx,cy,s)
def moon(cx,cy,r):
    return '<path d="M%.1f,%.1f A%.1f,%.1f 0 1 0 %.1f,%.1f A%.1f,%.1f 0 1 1 %.1f,%.1f Z" fill="url(#gold)" stroke="#5A3600" stroke-width="1.2" filter="url(#sh)"/>'%(cx+r*.3,cy-r*.95,r,r,cx+r*.3,cy+r*.95,r*.78,r*.78,cx+r*.3,cy-r*.95)


def skull(cx,cy,s,eye='#FF1A1A'):
    g='<g transform="translate(%.1f %.1f) scale(%.2f)" filter="url(#sh)">'%(cx,cy,s)
    g+='<path d="M-14,-4 C-14,-22 14,-22 14,-4 C14,4 10,6 8,8 L8,14 L-8,14 L-8,8 C-10,6 -14,4 -14,-4Z" fill="url(#bone)" stroke="#3A3020" stroke-width="1"/>'
    g+='<ellipse cx="-6" cy="-3" rx="4.2" ry="5" fill="#120808"/><ellipse cx="6" cy="-3" rx="4.2" ry="5" fill="#120808"/>'
    g+='<circle cx="-6" cy="-2" r="1.8" fill="%s"/><circle cx="6" cy="-2" r="1.8" fill="%s"/>'%(eye,eye)
    g+='<path d="M0,3 L-2,7 L2,7Z" fill="#120808"/>'+''.join('<line x1="%d" y1="9" x2="%d" y2="14" stroke="#3A3020" stroke-width=".9"/>'%(x,x) for x in (-5,-2,1,4))
    return g+'</g>'
def horn(side,s=1):
    tr='translate(%.1f 60) scale(%d 1) scale(%.2f)'%(200+side*70,side,s)
    return '<path d="M0,30 C -10,0 10,-40 60,-62 C 30,-40 26,-10 34,22 Z" fill="url(#horn)" stroke="#120000" stroke-width="1.5" transform="%s" filter="url(#sh)"/>'%tr + ''.join('<path d="M%d,%d q8,-4 14,-2" stroke="#120000" stroke-width="1.2" fill="none" opacity=".6" transform="%s"/>'%(6+i*7,18-i*14,tr) for i in range(4))
def batwing(side,s=1,g='batw'):
    tr='translate(%.1f 190) scale(%d 1) scale(%.2f)'%(200+side*118,side,s)
    d='M0,0 L40,-90 L58,-96 L70,-60 Q86,-70 96,-50 Q110,-56 118,-30 Q130,-30 132,-6 Q110,-16 96,4 Q84,-10 66,14 Q56,0 40,20 Q26,8 0,24Z'
    o='<path d="%s" fill="url(#%s)" stroke="#E0A0FF" stroke-width="1.4" transform="%s" filter="url(#rim)"/>'%(d,g,tr)
    for x,y in ((58,-96),(96,-50),(132,-6)): o+='<path d="M8,4 Q%d,%d %d,%d" stroke="#6A3A7A" stroke-width="2" fill="none" transform="%s"/>'%(x*.5,y*.6,x,y,tr)
    o+='<path d="M40,-90 l-4,-14 l10,10z" fill="#B8A890" transform="%s"/>'%tr
    return o
def web(r1,r2,n=16):
    o=''.join('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#E8E8F0" stroke-width="1.1" opacity=".75"/>'%(*P(i*360/n,r1),*P(i*360/n,r2)) for i in range(n))
    for k in range(4):
        r=r1+(r2-r1)*(k+1)/5; pts=[P(i*360/n,r) for i in range(n+1)]
        o+='<path d="M'+' Q'.join(('%.1f,%.1f %.1f,%.1f'%(*P((i-.5)*360/n,r*.97),*pts[i])) if i else '%.1f,%.1f'%pts[0] for i in range(n+1))+'" fill="none" stroke="#E8E8F0" stroke-width="1" opacity=".6"/>'
    return o
def spider(cx,cy,s):
    g='<g transform="translate(%.1f %.1f) scale(%.2f)" filter="url(#sh)">'%(cx,cy,s)
    for sd in (-1,1):
        for i in range(4): g+='<path d="M0,%d q%d,-10 %d,%d" stroke="#0A0A0A" stroke-width="2.4" fill="none"/>'%(i*3-4,sd*14,sd*22,6+i*4)
    g+='<ellipse cx="0" cy="6" rx="8" ry="10" fill="#141014"/><circle cx="0" cy="-6" r="6" fill="#141014"/><path d="M-4,4 l4,6 l4,-6z" fill="#C8001A"/><circle cx="-2" cy="-7" r="1.4" fill="#FF2A2A"/><circle cx="2" cy="-7" r="1.4" fill="#FF2A2A"/>'
    return g+'<line x1="0" y1="-12" x2="0" y2="-60" stroke="#E8E8F0" stroke-width="1"/></g>'
def chain(r,n):
    o=''
    for i in range(n):
        x,y=P(i*360/n,r); o+='<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="none" stroke="url(#iron)" stroke-width="4" transform="rotate(%.1f %.1f %.1f)"/>'%(x,y,7 if i%2 else 3.5,4 if i%2 else 7,i*360/n,x,y)
    return '<g filter="url(#sh)">'+o+'</g>'
def thorns(r,n,L=16,fill='url(#iron)'):
    return '<g filter="url(#sh)">'+''.join('<path d="M-4,0 Q-1,-%.1f 0,-%.1f Q1,-%.1f 4,0Z" fill="%s" transform="translate(%.1f %.1f) rotate(%.1f)"/>'%(L*.5,L,L*.5,fill,*P(i*360/n+(5 if i%2 else -5),r),i*360/n+(25 if i%2 else -25)) for i in range(n))+'</g>'
def drips(r,n):
    o=''
    for i in range(n):
        a=150+i*60/(n-1); x,y=P(a,r); L=10+ (i*7)%14
        o+='<path d="M%.1f,%.1f q-3,%.1f 0,%.1f q3,-%.1f 0,-%.1f" fill="url(#blood)" transform="rotate(0)"/><circle cx="%.1f" cy="%.1f" r="3.4" fill="#B00010"/>'%(x-1,y,L,L+4,L,L+4,x-1,y+L+4)
    return '<g filter="url(#sh)">'+o+'</g>'
def impcrown(cx,cy,w):
    h=w*.75; o=''
    o+='<path d="M%.1f,%.1f Q%.1f,%.1f %.1f,%.1f Q%.1f,%.1f %.1f,%.1f Z" fill="url(#velvet)" stroke="#3A0008"/>'%(cx-w*.42,cy-h*.18,cx-w*.3,cy-h*1.05,cx,cy-h*.95,cx+w*.3,cy-h*1.05,cx+w*.42,cy-h*.18)
    for k in (-1,0,1):
        o+='<path d="M%.1f,%.1f Q%.1f,%.1f %.1f,%.1f" fill="none" stroke="url(#gold)" stroke-width="%.1f" stroke-linecap="round"/>'%(cx+k*w*.44,cy-h*.15,cx+k*w*.36,cy-h*1.0,cx,cy-h*.98,w*.06)
    o+=''.join('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="url(#pearl)"/>'%(cx+k*w*.08,cy-h*(.4+.12*abs(k)),w*.025) for k in (-3,-2,-1,1,2,3))
    o+='<circle cx="%.1f" cy="%.1f" r="%.1f" fill="url(#goldR)" stroke="#5A3600"/>'%(cx,cy-h*1.0,w*.075)
    o+='<path d="M%.1f,%.1f h%.1f v-%.1f h%.1f v%.1f h%.1f v%.1f h-%.1f v%.1f h-%.1f v-%.1f h-%.1fZ" fill="url(#gold)" stroke="#5A3600" stroke-width="1"/>'%(cx-w*.03,cy-h*1.07,w*.06,w*.08,w*.06*0+w*.06,w*.08,w*.06,w*.06,w*.06,w*.08,w*.06,w*.08,w*.06)
    o+='<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="4" fill="url(#gold2)" stroke="#5A3600" stroke-width="1.2"/>'%(cx-w*.5,cy-h*.2,w,h*.26)
    o+='<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="#F4F0E8" stroke="#5A3600" stroke-width=".8"/>'%(cx-w*.52,cy+h*.04,w*1.04,h*.1)+''.join('<circle cx="%.1f" cy="%.1f" r="1.6" fill="#111"/>'%(cx-w*.48+i*w*.08,cy+h*.09) for i in range(13))
    return '<g filter="url(#sh)">'+o+gem(cx,cy-h*.07,w*.09,'ruby')+gem(cx-w*.3,cy-h*.07,w*.06,'sapph',6)+gem(cx+w*.3,cy-h*.07,w*.06,'sapph',6)+gem(cx-w*.15,cy-h*.07,w*.045,'emer',6)+gem(cx+w*.15,cy-h*.07,w*.045,'emer',6)+'</g>'
def scepter(side):
    tr='translate(%.1f 330) rotate(%d)'%(200+side*40,side*-38)
    return '<g transform="%s" filter="url(#sh)"><rect x="-4" y="-150" width="8" height="150" rx="3" fill="url(#gold2)" stroke="#5A3600"/>'%tr+''.join('<rect x="-6" y="%d" width="12" height="5" rx="2" fill="url(#gold)"/>'%y for y in (-110,-60,-20))+'<circle cx="0" cy="-160" r="12" fill="url(#goldR)" stroke="#5A3600"/>'+gem(0,-160,9,'ruby')+'</g>'
def sultan(cx,cy,w):
    h=w*.9; o='<path d="M%.1f,%.1f C%.1f,%.1f %.1f,%.1f %.1f,%.1f C%.1f,%.1f %.1f,%.1f %.1f,%.1f Z" fill="url(#turq)" stroke="url(#gold)" stroke-width="4"/>'%(cx-w*.45,cy,cx-w*.5,cy-h*.6,cx-w*.1,cy-h*.7,cx,cy-h,cx+w*.1,cy-h*.7,cx+w*.5,cy-h*.6,cx+w*.45,cy)
    for k in (-.25,0,.25): o+='<path d="M%.1f,%.1f Q%.1f,%.1f %.1f,%.1f" stroke="url(#gold)" stroke-width="2.5" fill="none"/>'%(cx+k*w*1.4,cy,cx+k*w*.9,cy-h*.6,cx,cy-h*.98)
    o+='<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="5" fill="url(#gold2)" stroke="#5A3600"/>'%(cx-w*.52,cy-h*.12,w*1.04,h*.2)
    o+=moon(cx+w*.08,cy-h*1.18,w*.13)
    return '<g filter="url(#sh)">'+o+gem(cx,cy-h*.02,w*.08,'ruby')+gem(cx-w*.3,cy-h*.02,w*.055,'emer',6)+gem(cx+w*.3,cy-h*.02,w*.055,'emer',6)+gem(cx,cy-h*.45,w*.1,'turq')+'</g>'

F={}
R2=lambda a,b,g='gold',e='#FFF6C4',d='#4A2A00': ring(a,b,g,e,d)
F['lv_bronze']=ring(134,156,'bronze','#FFE2C4','#3A1A04')+notches(145,56,'#3A1A04')+beads(160,36,3.5,'url(#bronze)')+gem(200,40,20,'topaz')+gem(200,360,13,'topaz',6)
F['lv_silver']=leafarc(196,256,172,7,'url(#silver)',18)+leafarc(164,104,172,7,'url(#silver)',18)+ring(134,156,'silver','#FFFFFF','#2A3036')+beads(145,40,3.6,'url(#pearl)')+gem(200,38,22,'sapph')+gem(200,362,14,'sapph',6)
F['lv_gold']=leafarc(190,280,176,10,'url(#gold)',20)+leafarc(170,80,176,10,'url(#gold)',20)+ring(132,158,'gold')+beads(145,44,3.4)+''.join(scroll(a,160,1.5) for a in (-30,))+''.join(scroll(a,160,1.5,flip=True) for a in (30,))+gem(200,34,24,'emer')+gem(200,364,15,'emer',6)
F['lv_moon']=ring(132,156,'purp','#F3D9FF','#1A0430')+beads(144,40,3,'url(#goldR)')+moon(268,40,52)+''.join(star8(*P(a,182),r) for a,r in ((-35,16),(-62,10),(-14,9),(205,14),(155,11),(110,8),(250,8)))+gem(200,360,16,'amet')
F['sv_rose']=''.join(leaf(*P(a,170),a+70,1.6) for a in (200,224,248,112,136,160,-22,22))+ring(134,154,'rosegold','#FFE4E1','#4A1414')+rosef(*P(215,170),38)+rosef(*P(180,180),30)+rosef(*P(145,170),38)+rosef(*P(-24,168),26)+rosef(*P(24,168),26)+heart(200,30,2.1)
F['st_week']=''.join(star8(*P(i*45,176),24) for i in range(8))+''.join(gem(*P(i*45,176),11,'emer',6) for i in range(8))+ring(132,158,'gold')+''.join('<circle cx="%.1f" cy="%.1f" r="8" fill="#0A6B3A" stroke="url(#gold)" stroke-width="2.4"/>'%P(i*30+15,145) for i in range(12))
F['sv_pearl']=beads(170,34,8,'url(#pearl)')+ring(134,152,'silver','#FFFFFF','#2A3036')+beads(143,48,4.4,'url(#pearl)')+gem(200,26,24,'sapph')+''.join(gem(*P(a,170),13,'dia',6) for a in (90,180,270))
F['sv_hearts']=ring(134,154,'rosegold','#FFE4E1','#4A1414')+''.join(heart(*P(i*30,176),1.7 if i%3 else 2.4) for i in range(12))
F['sv_ice']=shards(28,154,60)+ring(134,156,'ice','#FFFFFF','#0A2E66')+beads(145,36,3,'#FFFFFF')+gem(200,30,24,'dia')+''.join(gem(*P(a,156),13,'sapph',6) for a in (120,240))
F['v_fire']=flames(30,150,'flame',1.9)+flames(22,146,'flame',1.2)+ring(132,156,'gold')+''.join(gem(*P(a,144),9,'ruby',6) for a in range(0,360,45))+gem(200,366,18,'ruby')
F['v_bolt']=flames(30,150,'flameB',1.9)+flames(22,146,'flameB',1.2)+ring(132,156,'silver','#FFFFFF','#0A2E66')+''.join(gem(*P(a,144),9,'sapph',6) for a in range(0,360,45))+gem(200,366,18,'sapph')
F['v_amet']=''.join(scroll(a,166,1.8,'gold',f) for a in range(-150,180,60) for f in (False,True))+ring(130,156,'purp','#F3D9FF','#1A0430')+ring(156,166,'gold')+beads(143,44,3,'url(#goldR)')+gem(200,30,28,'amet')+''.join(gem(*P(a,166),14,'amet') for a in (90,270,180))
F['v_wings']=wing(-1)+wing(1)+ring(132,156,'gold')+beads(144,44,3,'#FFFFFF')+'<ellipse cx="200" cy="24" rx="64" ry="15" fill="none" stroke="url(#gold)" stroke-width="9" filter="url(#sh)"/>'+gem(200,362,17,'sapph')
F['v_gwings']=wing(-1,'featherG','#8A5A00')+wing(1,'featherG','#8A5A00')+ring(132,158,'gold')+beads(145,44,3.4)+crown(200,62,140,'ruby')+gem(200,364,18,'ruby')+''.join(gem(*P(a,145),10,'sapph',6) for a in (60,300))
F['v_crown']=leafarc(204,290,182,10,'url(#gold)',22)+leafarc(156,70,182,10,'url(#gold)',22)+ring(128,152,'gold')+ring(152,162,'gold2','#FFF6C4','#4A2A00')+beads(140,52,3,'url(#pearl)')+crown(200,74,176,'ruby')+gem(200,368,22,'ruby')+''.join(gem(*P(a,157),13,k) for a,k in ((90,'sapph'),(270,'sapph'),(135,'emer'),(225,'emer')))
F['v_king']=flames(34,152,'flame',1.6)+wing(-1,'featherG','#8A5A00')+wing(1,'featherG','#8A5A00')+ring(128,152,'gold')+ring(152,162,'gold2','#FFF6C4','#4A2A00')+beads(140,52,3)+crown(200,72,184,'ruby')+gem(200,370,24,'dia')+''.join(gem(*P(a,157),11,'ruby',6) for a in (60,120,240,300))
F['h_skull']=flames(26,150,'flameG',1.7)+ring(132,156,'iron','#9AA0A8','#000')+''.join(skull(*P(a,152),1.15 if a%90 else 1.6,'#3CFF5A') for a in range(0,360,45))
F['h_demon']=flames(32,150,'flameD',2.0)+batwing(-1,1.1,'batr')+batwing(1,1.1,'batr')+ring(132,156,'blood','#FF7070','#120000')+horn(-1,1.15)+horn(1,1.15)+drips(152,7)+skull(200,360,2.0)+''.join(gem(*P(a,144),9,'blood') for a in (60,300,120,240))
F['h_bat']=batwing(-1,1.15)+batwing(1,1.15)+ring(132,154,'iron','#9AA0A8','#000')+beads(143,40,3,'#6A0010')+skull(200,40,1.9,'#FF2A2A')+gem(200,362,15,'blood')
F['h_web']=web(150,214)+ring(132,152,'purp','#E0B0FF','#0A0018')+thorns(154,24,18)+spider(292,92,1.6)+gem(200,362,15,'toxic')
F['h_reaper']=flames(30,148,'flameP',1.8)+chain(160,40)+ring(132,152,'iron','#C8A0FF','#000')+thorns(152,30,14,'url(#purp)')+skull(200,34,2.2,'#C04CFF')+gem(200,364,15,'amet')
F['r_emperor']='<path d="M128,70 Q130,-20 200,-24 Q270,-20 272,70Z" fill="url(#velvet)" stroke="url(#gold)" stroke-width="5" filter="url(#sh)"/>'+leafarc(206,292,182,10,'url(#gold)',22)+leafarc(154,68,182,10,'url(#gold)',22)+ring(126,150,'gold')+ring(150,160,'velvet','#FF9A9A','#200004')+ring(160,166,'gold')+beads(138,52,3,'url(#pearl)')+crown(200,76,180,'ruby')+gem(200,370,24,'ruby')+''.join(gem(*P(a,155),11,k) for a,k in ((90,'emer'),(270,'emer'),(135,'sapph'),(225,'sapph')))
F['r_sultan']=''.join(star8(*P(i*30+15,176),18) for i in range(12))+''.join(gem(*P(i*30+15,176),8,'turq',6) for i in range(12))+ring(130,154,'gold')+ring(154,162,'turq','#B8FFF4','#022A26')+beads(142,48,3,'url(#goldR)')+sultan(200,82,150)+gem(200,366,20,'emer')
F['r_diamond']=shards(36,156,30)+ring(128,150,'plat','#FFFFFF','#2A3A4A')+ring(150,158,'silver','#FFFFFF','#2A3A4A')+''.join(gem(*P(i*15,139),5.5,'dia',6) for i in range(24))+crown(200,70,170,'dia').replace('url(#gold)','url(#plat)').replace('url(#gold2)','url(#silver)')+gem(200,368,24,'dia')+''.join(gem(*P(a,154),12,'dia') for a in (90,270))

for k,v in F.items():
    sv='<svg xmlns="http://www.w3.org/2000/svg" viewBox="-60 -60 520 520" width="520" height="520"><defs>'+DEFS+'<mask id="hole"><rect x="-60" y="-60" width="520" height="520" fill="#fff"/><circle cx="200" cy="200" r="131" fill="#000"/></mask></defs><g mask="url(#hole)">'+v+'</g></svg>'
    open(k+'.svg','w').write(sv)
print(len(F))
