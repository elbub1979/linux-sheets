'use strict';

const DATA = [
  {
    id:"nav", title:"Навигация и файлы", tag:"базовое",
    note:"Абсолютный путь от корня /; относительный — от текущего каталога. Для доступа к файлу нужен x на каждом каталоге пути.",
    rows:[
      ["pwd","Текущий каталог (абсолютный путь)"],
      ["ls -lah <b>путь</b>","Содержимое каталога: <code>-l</code> — подробно, <code>-a</code> — скрытые, <code>-h</code> — человекочитаемые размеры"],
      ["cd <b>путь</b>","Перейти в каталог; <code>cd -</code> — вернуться в предыдущий; <code>cd ~</code> — домашний"],
      ["mkdir -p <b>a/b/c</b>","Создать вложенные каталоги; <code>-p</code> не ругается, если уже есть"],
      ["cp -a <b>src dst</b>","Копировать с сохранением прав, владельца и ссылок (<code>-a</code> = <code>-dpR</code>)"],
      ["mv <b>old new</b>","Переместить/переименовать; атомарно в пределах одной ФС"],
      ["rm -rf <b>путь</b>","<span class='danger'>Опасно:</span> рекурсивное удаление без подтверждения; <code>-r</code> — рекурсия, <code>-f</code> — без вопросов"],
      ["ln -s <b>цель ссылка</b>","Символическая ссылка; <code>ln</code> без <code>-s</code> — жёсткая (не работает между ФС)"],
      ["find <b>.</b> -name '<b>*.log</b>' -mtime +7","Найти файлы по имени и возрасту; <code>-type f</code>/<code>d</code>, <code>-size +100M</code>, <code>-exec</code>"],
      ["namei -l <b>/path/to/file</b>","Разложить путь по компонентам с правами — видно, где нет <code>x</code> на каталоге"],
      ["findmnt -T <b>/path</b>","Какая ФС примонтирована для этого пути; видны опции (<code>noexec</code>, <code>nosuid</code>)"],
      ["readlink -f <b>ссылка</b>","Разрешить цепочку симлинков до финального абсолютного пути"],
      ["tree -L 2 <b>путь</b>","Дерево каталогов с глубиной 2"]
    ]
  },
  {
    id:"perm", title:"Права и владельцы", tag:"базовое",
    note:"rwx для файла: r — читать, w — писать, x — исполнять. Для каталога: r — листинг, w — создавать/удалять внутри, x — входить (cd) и обращаться к содержимому. Без x на каталоге ничего внутри не доступно.",
    rows:[
      ["chmod 755 <b>файл</b>","Установить права числом: <code>7</code>=rwx владелец, <code>5</code>=r-x группа, <code>5</code>=r-x остальные"],
      ["chmod u+x,g-w <b>файл</b>","Символьная запись: <code>u</code>ser, <code>g</code>roup, <code>o</code>ther, <code>a</code>ll; +/- добавить/убрать"],
      ["chmod -R o-rwx <b>каталог</b>","Рекурсивно убрать все права для «остальных»; <span class='danger'>-R по системным путям — опасно</span>"],
      ["chown <b>user</b>:<b>group</b> <b>файл</b>","Сменить владельца и группу; <code>chown -R</code> — рекурсивно; <span class='danger'>-R / — сломает систему</span>"],
      ["chown :<b>group</b> <b>файл</b>","Сменить только группу (без пользователя перед <code>:</code>)"],
      ["stat -c '%a %U:%G %n' <b>файл</b>","Показать числовые права, владельца:группу и имя; <code>%A</code> — символьно"],
      ["chmod u+s <b>бинарник</b>","SUID: процесс получает uid владельца файла при запуске (как <code>passwd</code>)"],
      ["chmod g+s <b>каталог</b>","SGID на каталоге: новые файлы наследуют группу каталога"],
      ["chmod +t <b>каталог</b>","Sticky bit: удалять файлы может только владелец (как в <code>/tmp</code>)"],
      ["umask 027","Маска по умолчанию: новые файлы 640, каталоги 750; действует на текущую сессию"],
      ["getfacl <b>файл</b>","Показать расширенные ACL (<code>setfacl -m u:user:rw файл</code> — добавить)"]
    ]
  },
  {
    id:"users", title:"Пользователи и группы", tag:"базовое",
    note:"Смена владельца не даёт прав автоматически — нужен chmod. getent видит AD/LDAP-источники, а не только /etc/passwd.",
    rows:[
      ["id","UID, GID и все группы текущего пользователя"],
      ["whoami","Эффективное имя пользователя (после su/sudo)"],
      ["getent passwd <b>user</b>","Запись пользователя из всех источников (локальные, LDAP, SSSD)"],
      ["getent group <b>group</b>","Список участников группы из всех NSS-источников"],
      ["useradd -m -s /bin/bash <b>user</b>","Создать пользователя с домашним каталогом и оболочкой"],
      ["usermod -aG <b>group</b> <b>user</b>","Добавить в группу; <span class='danger'>без <code>-a</code> (<code>usermod -G</code>) — выкинет из всех остальных групп!</span>"],
      ["userdel -r <b>user</b>","Удалить пользователя вместе с домашним каталогом (<code>-r</code>)"],
      ["passwd <b>user</b>","Установить/сменить пароль пользователя"],
      ["chage -l <b>user</b>","Показать политику паролей; <code>chage -E 2025-12-31 user</code> — задать дату истечения аккаунта"],
      ["newgrp <b>group</b>","Открыть новую оболочку с другой активной группой (без логаута)"],
      ["groups <b>user</b>","Список групп пользователя (компактнее <code>id</code>)"],
      ["su - <b>user</b>","Переключиться на пользователя с его окружением (<code>-</code> = login shell)"]
    ]
  },
  {
    id:"text", title:"Текст, потоки, фильтры", tag:"базовое",
    note:"Потоки: stdout (1), stderr (2). > перезаписывает, >> дописывает. 2>&1 перенаправляет stderr в stdout. Пайп | передаёт stdout одной команды на stdin другой.",
    rows:[
      ["cmd > <b>file</b>","Перенаправить stdout в файл (перезапись); <code>>></code> — дозапись"],
      ["cmd 2> <b>err.log</b>","Перенаправить stderr; <code>2>&1</code> — stderr в тот же поток, что stdout"],
      ["cmd1 | cmd2","Пайп: stdout cmd1 → stdin cmd2; для stderr тоже: <code>|&</code> (bash 4+)"],
      ["grep -inC2 '<b>pattern</b>' <b>файл</b>","<code>-i</code> — без регистра, <code>-n</code> — номера строк, <code>-C2</code> — контекст ±2 строки"],
      ["grep -rq '<b>pattern</b>' <b>каталог</b>","<code>-r</code> — рекурсивно, <code>-q</code> — тихий (для if); <code>-v</code> — инвертировать; <code>-c</code> — количество совпадений"],
      ["grep -P '<b>regex</b>' <b>файл</b>","Perl-совместимый regex (<code>-P</code>); <code>-E</code> — расширенный; <code>-o</code> — только совпадение"],
      ["awk -F: '{print $1, $3}' /etc/passwd","Разделитель <code>-F:</code>; вывод полей $1, $3; условие: <code>awk '$3>1000'</code>"],
      ["awk '/ERROR/{count++} END{print count}' <b>file</b>","Подсчёт строк по шаблону; <code>BEGIN</code>/<code>END</code> блоки для итогов"],
      ["sed -i 's/<b>old</b>/<b>new</b>/g' <b>файл</b>","Замена на месте; <code>-i.bak</code> — с бэкапом; <code>/g</code> — все вхождения в строке"],
      ["sort -k1,1nr <b>файл</b>","Сортировка по 1-му полю числовая (<code>-n</code>) обратная (<code>-r</code>); <code>-t:</code> — разделитель"],
      ["uniq -c","Подсчёт одинаковых строк; <span class='hl'>работает только после sort</span> (схлопывает лишь соседние)"],
      ["wc -l <b>файл</b>","Количество строк; <code>-w</code> — слов, <code>-c</code> — байт"],
      ["cut -d: -f1,3 /etc/passwd","Вырезать поля 1 и 3 с разделителем <code>:</code>"],
      ["head -n 20 / tail -n 50 <b>файл</b>","Первые / последние N строк; <code>tail -f</code> — следить за дозаписью в реальном времени"],
      ["tee <b>файл</b>","Дублирует stdin в файл и на stdout: <code>cmd | tee log.txt</code>"]
    ]
  },
  {
    id:"proc", title:"Процессы", tag:"средний",
    note:"Процесс — единица изоляции (своё адресное пространство); поток (thread) — единица выполнения внутри процесса. Состояния: R — выполняется/готов, S — спит (прерываемо), D — ожидает I/O (непрерываемо, нельзя убить), Z — зомби. Load average = число процессов в R + D, а не % CPU; сравнивать с nproc.",
    rows:[
      ["ps auxf","Все процессы с деревом (<code>f</code>); <code>a</code> — все пользователи, <code>u</code> — подробно, <code>x</code> — без терминала"],
      ["ps -eo pid,ppid,stat,%cpu,%mem,cmd --sort=-%mem","Выборочные поля с сортировкой; <code>stat</code> показывает R/S/D/Z"],
      ["pgrep -af '<b>pattern</b>'","PID + полная командная строка по шаблону; <code>-u user</code> — фильтр по пользователю"],
      ["kill -0 <b>PID</b>","Проверить существование процесса без отправки сигнала (exit 0 = жив)"],
      ["kill <b>PID</b>","Отправить SIGTERM (15) — вежливое завершение; процесс может перехватить и корректно завершиться"],
      ["kill -9 <b>PID</b>","<span class='danger'>SIGKILL — немедленное уничтожение ядром;</span> используй только если TERM не помог; процесс не успевает очистить ресурсы"],
      ["kill -HUP <b>PID</b>","SIGHUP (1): многие демоны перечитывают конфиг (nginx, sshd); для терминала — отключение"],
      ["kill -USR1 <b>PID</b>","Пользовательский сигнал; часто: ротация лога (nginx), дамп состояния"],
      ["nproc","Количество доступных CPU; load average &gt; nproc → система перегружена"],
      ["top -bn1 | head -20","Снимок top в пакетном режиме (<code>-b</code>); одна итерация (<code>-n1</code>)"],
      ["htop","Интерактивный мониторинг: F5 — дерево, F6 — сортировка, F9 — сигнал"],
      ["nice -n 10 <b>cmd</b>","Запустить с пониженным приоритетом; <code>renice -n 5 -p PID</code> — изменить для работающего"],
      ["nohup <b>cmd</b> &","Запустить в фоне; stdout/stderr → <code>nohup.out</code>; переживёт закрытие терминала"],
      ["timeout 30 <b>cmd</b>","Убить процесс, если не завершился за 30 секунд"]
    ]
  },
  {
    id:"zombie", title:"Зомби и сироты", tag:"средний",
    note:"Сирота — процесс, чей родитель завершился; его усыновляет PID 1 (systemd/init). Зомби — процесс завершился, но родитель не вызвал wait() и запись в таблице процессов осталась. Зомби нельзя убить — он уже мёртв; нужно заставить родителя прочитать статус.",
    rows:[
      ["ps -eo pid,ppid,stat,cmd | grep 'Z'","Найти зомби-процессы (статус Z / Z+)"],
      ["ps -eo ppid= -o stat= | awk '$2~/Z/{a[$1]++} END{for(p in a)print p,a[p]}'","Группировка зомби по PPID — находим виновного родителя"],
      ["kill -CHLD <b>PPID</b>","Отправить SIGCHLD родителю — напомнить вызвать wait(); может помочь с «забывчивым» родителем"],
      ["kill <b>PPID</b>","Завершить родителя зомби; PID 1 усыновит потомков и подчистит зомби через wait()"],
      ["kill -9 <b>PPID</b>","<span class='danger'>Крайняя мера:</span> убить родителя-зомбоделателя, если TERM не помог"],
      ["cat /proc/<b>PID</b>/status | grep -E 'State|PPid'","Состояние и PPID процесса из procfs; <code>Z (zombie)</code> в State"]
    ]
  },
  {
    id:"systemd", title:"systemd и сервисы", tag:"средний",
    note:"Сервис ≠ процесс: systemd отслеживает сервис через cgroup, не по PID. Один сервис может породить несколько процессов. После ручной правки unit-файла обязательно daemon-reload.",
    rows:[
      ["systemctl status <b>unit</b>","Статус, PID, последние строки журнала, дерево cgroup; <code>Active: active (running)</code>"],
      ["systemctl start|stop|restart <b>unit</b>","Управление сервисом; <code>restart</code> = stop + start"],
      ["systemctl enable --now <b>unit</b>","Включить автозапуск и запустить немедленно"],
      ["systemctl disable <b>unit</b>","Убрать из автозапуска (не останавливает)"],
      ["systemctl cat <b>unit</b>","Показать содержимое unit-файла (со всеми drop-in)"],
      ["systemctl show -p MainPID -p MemoryCurrent <b>unit</b>","Свойства сервиса: PID, текущая память, лимиты; любое свойство по имени"],
      ["systemctl list-units --failed","Упавшие сервисы; <code>--type=service</code> — только сервисы"],
      ["systemctl --user status <b>unit</b>","Пользовательские сервисы (не через sudo); лежат в <code>~/.config/systemd/user/</code>"],
      ["systemctl daemon-reload","<span class='hl'>Обязательно</span> после правки unit-файла — systemd перечитает конфигурацию"],
      ["systemctl list-timers","Таймеры (аналог cron); <code>--all</code> — включая неактивные"],
      ["journalctl -u <b>unit</b> -f","Журнал сервиса в реальном времени (сочетание с journalctl)"],
      ["systemd-analyze blame","Время запуска каждого сервиса при загрузке (поиск тормозов)"]
    ]
  },
  {
    id:"logs", title:"Логи · journalctl", tag:"средний",
    note:"journald хранит структурированные логи всех сервисов и ядра. Файловые логи приложения (/var/log/app/) — отдельный источник, journald их не видит.",
    rows:[
      ["journalctl -u <b>unit</b> -n 50","Последние 50 строк журнала сервиса"],
      ["journalctl -u <b>unit</b> --since '1 hour ago'","Записи за последний час; формат: <code>'2025-01-15 14:00'</code>, <code>'yesterday'</code>"],
      ["journalctl -p err","Только ошибки и выше (<code>emerg</code>/<code>alert</code>/<code>crit</code>/<code>err</code>/<code>warning</code>/<code>notice</code>/<code>info</code>/<code>debug</code>)"],
      ["journalctl -f","Следить за всеми журналами в реальном времени (аналог <code>tail -f</code>)"],
      ["journalctl -k","Журнал ядра текущей загрузки; эквивалент <code>dmesg</code> но с временными метками systemd"],
      ["journalctl -k | grep -i 'oom\\|killed'","Искать OOM-killer: ядро убивает процесс при нехватке памяти"],
      ["dmesg -T","Сообщения ядра с человекочитаемыми метками времени (не journald)"],
      ["dmesg -T | tail -30","Последние 30 сообщений ядра: ошибки диска, сеть, OOM, аппаратные проблемы"],
      ["journalctl --disk-usage","Сколько места занимает журнал; <code>--vacuum-size=500M</code> — обрезать до 500 МБ"],
      ["journalctl -b -1","Журнал предыдущей загрузки (<code>-b 0</code> — текущая, <code>--list-boots</code> — все)"],
      ["tail -f /var/log/<b>app</b>/<b>error.log</b>","Файловые логи: не в journald; <code>multitail</code> — несколько файлов одновременно"],
      ["logger -t <b>mytag</b> 'test message'","Отправить сообщение в syslog/journald для тестирования"]
    ]
  },
  {
    id:"disk", title:"Диск, место, inode", tag:"средний",
    note:"df показывает блоки раздела (вся ФС); du считает по именам файлов. Удалённый открытый файл не освобождает место (df не уменьшится) — lsof +L1 покажет. Если inode кончились — нельзя создать файлы даже при свободном месте.",
    rows:[
      ["df -hT","Свободное место на разделах: <code>-h</code> — человекочитабельно, <code>-T</code> — тип ФС"],
      ["df -i","<span class='hl'>Inode</span> по разделам: если Used=100% — новые файлы не создать, даже если место есть"],
      ["du -sh <b>каталог</b>","Суммарный размер каталога; <code>-s</code> — только итог, <code>-h</code> — человекочитабельно"],
      ["du -h --max-depth=1 <b>/</b> | sort -hr | head -20","Топ-20 каталогов по размеру на корне"],
      ["lsof +L1","Удалённые, но открытые файлы (занимают место; <code>df</code> видит, <code>du</code> — нет); верить <code>df</code>"],
      ["truncate -s 0 <b>/var/log/big.log</b>","Обнулить файл без удаления (fd процесса не сломается); <span class='hl'>вместо rm для открытых логов</span>"],
      ["find <b>/</b> -xdev -type f -size +100M","Найти файлы >100 МБ; <code>-xdev</code> — не уходить на другие ФС"],
      ["mount -a","<span class='hl'>Проверка fstab:</span> смонтировать всё из <code>/etc/fstab</code>; ошибка здесь = не загрузится после ребута"],
      ["tune2fs -m 1 <b>/dev/sdX</b>","Уменьшить зарезервированные блоки (по умолчанию 5%) до 1%; для не-рутовых ФС"],
      ["findmnt -l","Все точки монтирования (аналог <code>mount</code>, но читабельнее)"],
      ["blkid","UUID и тип ФС всех блочных устройств; для fstab лучше UUID, а не /dev/sdX"],
      ["xfs_info <b>/mount</b>","Параметры XFS (размер блока, лога); для ext: <code>dumpe2fs -h /dev/sdX</code>"]
    ]
  },
  {
    id:"mem", title:"Память и OOM", tag:"средний",
    note:"Смотреть available, а не free: ядро отдаёт кэш под приложения автоматически. Кэш (buff/cache) — reclaimable. OOM-killer убивает процесс с exit code 137 (128+9 = SIGKILL). Лимит cgroup: MemoryMax в systemd.",
    rows:[
      ["free -h","<span class='hl'>available</span> — сколько реально можно выделить (free + reclaimable cache); <code>free</code> — без кэша"],
      ["cat /proc/meminfo","Детальная информация: MemAvailable, Buffers, Cached, SwapTotal/Free, Dirty"],
      ["vmstat 1 5","5 замеров через 1 секунду; <code>si</code>/<code>so</code> — swap in/out (>0 → мало памяти); <code>r</code>/<code>b</code> — очередь CPU/IO"],
      ["cat /proc/pressure/memory","PSI: <code>some</code> — кто-то ждёт память; <code>full</code> — все ждут; отношение avg10/avg60"],
      ["swapon --show","Активные swap-разделы/файлы и их использование"],
      ["systemctl show <b>unit</b> -p MemoryMax -p MemoryCurrent","Лимит памяти cgroup для сервиса; MemoryMax=infinity — без лимита"],
      ["cat /sys/fs/cgroup/<b>slice</b>/memory.max","Прямой лимит cgroup v2; <code>memory.current</code> — текущее потребление"],
      ["dmesg -T | grep -i 'oom\\|killed process'","OOM-killer в журнале ядра: показывает какой процесс убит и почему"],
      ["journalctl -k --grep='oom'","Альтернатива для поиска OOM-событий через journald"],
      ["echo 3 > /proc/sys/vm/drop_caches","Сбросить page cache/dentries/inodes; безопасно, но кратковременно замедлит I/O"],
      ["exit code 137","Процесс убит SIGKILL (9): 128+9=137; типично — OOM-killer или <code>kill -9</code>"],
      ["exit code 143","Процесс получил SIGTERM (15): 128+15=143; штатное завершение по запросу"]
    ]
  },
  {
    id:"net", title:"Сеть", tag:"средний",
    note:"bind 127.0.0.1 — слушает только локально; 0.0.0.0 — на всех интерфейсах (доступно снаружи). TIME_WAIT в Linux длится 60 секунд.",
    rows:[
      ["ss -tlnp","TCP-сокеты в состоянии LISTEN: <code>-t</code> TCP, <code>-l</code> listen, <code>-n</code> числа, <code>-p</code> процесс"],
      ["ss -tulnp","То же + UDP (<code>-u</code>); видно PID и имя процесса для каждого порта"],
      ["ss -tnp state established","Установленные TCP-соединения; <code>state time-wait</code> — ожидающие закрытия (60 с в Linux)"],
      ["ls -l /proc/<b>PID</b>/fd | grep socket","Сокеты процесса по inode; сопоставить с <code>ss -tnpe</code> по номеру inode"],
      ["curl -sS -o /dev/null -w '%{http_code}\\n' <b>URL</b>","Только HTTP-код ответа; <code>-I</code> — заголовки; <code>--connect-timeout 3</code>"],
      ["curl -v <b>URL</b> 2>&1 | grep -E 'Connected|< HTTP'","Диагностика соединения: IP, порт, ответ сервера"],
      ["ip addr show","IP-адреса на интерфейсах; <code>ip -br a</code> — краткий формат"],
      ["ip route","Таблица маршрутизации; <code>ip route get 8.8.8.8</code> — каким путём пойдёт пакет"],
      ["ssh -o IdentitiesOnly=yes -i <b>~/.ssh/key</b> <b>host</b>","Использовать только указанный ключ (не перебирать из ssh-agent)"],
      ["ssh-keygen -lf <b>~/.ssh/id_rsa.pub</b>","Отпечаток ключа для сверки; <code>-E md5</code> — формат MD5"],
      ["dig <b>domain</b> +short","DNS-резолв; <code>+trace</code> — пошаговый; <code>@8.8.8.8</code> — через конкретный DNS"],
      ["ping -c 4 <b>host</b>","4 пакета ICMP; <code>-W 2</code> — таймаут ответа 2 с; <code>traceroute</code> — маршрут"],
      ["iptables -L -n -v","Правила фаервола (legacy); <code>nft list ruleset</code> — nftables"]
    ]
  },
  {
    id:"diag", title:"Диагностика: strace, lsof, perf", tag:"диагностика",
    note:"Процесс висит с CPU 0% и read() в стеке — ждёт ответа по сети, а не загружает CPU. strace использует ptrace и тормозит процесс; на проде — коротко (timeout 5 strace -c) или eBPF.",
    rows:[
      ["strace -p <b>PID</b> -e trace=openat","Системные вызовы живого процесса; <code>openat</code> — открытие файлов"],
      ["strace -p <b>PID</b> -e trace=network","Только сетевые вызовы: connect, sendto, recvfrom — кого ждём"],
      ["strace -f -p <b>PID</b>","<code>-f</code> — следить за потоками и дочерними процессами"],
      ["timeout 5 strace -c -p <b>PID</b>","<span class='hl'>Безопасно на проде:</span> 5-секундная статистика по syscall (не поток вывода)"],
      ["strace -T -e trace=read,write -p <b>PID</b>","<code>-T</code> — время каждого вызова; видно задержки на read/write"],
      ["ltrace -p <b>PID</b>","Вызовы библиотечных функций (malloc, strcmp); отдельно от strace"],
      ["lsof -p <b>PID</b>","Все открытые файлы процесса: обычные, сокеты, pipe, библиотеки"],
      ["lsof -i :<b>порт</b>","Кто слушает или подключён к порту"],
      ["lsof +L1","Удалённые, но открытые файлы (занимают место на диске)"],
      ["cat /proc/<b>PID</b>/status","Состояние, память (VmRSS), потоки (Threads), UID/GID, сигналы"],
      ["cat /proc/<b>PID</b>/cgroup","К какой cgroup принадлежит процесс (и её лимиты)"],
      ["perf top","Реальное время: какие функции ядра/процесса тратят CPU; как top но для функций"],
      ["perf stat -p <b>PID</b> sleep 5","Аппаратные счётчики за 5 с: кеш-промахи, branch-miss, IPC"]
    ]
  },
  {
    id:"io", title:"Нагрузка: iostat, диск I/O", tag:"диагностика",
    note:"Высокий load average ≠ нагрузка на CPU: может быть дисковый I/O (D-процессы). Первый вывод iostat — среднее с момента загрузки, игнорировать его.",
    rows:[
      ["iostat -xz 1","Расширенная статистика дисков каждую секунду; <span class='hl'>первый вывод — средняя с загрузки, пропустить</span>"],
      ["iostat: %util","% времени, когда устройство обрабатывало запросы; 100% ≠ предел (параллелизм), но сигнал"],
      ["iostat: await","Среднее время обработки запроса (мс); высокое await при низком %util → проблема латентности"],
      ["iostat: aqu-sz","Средний размер очереди запросов; растёт → диск не успевает"],
      ["vmstat 1","<code>r</code> — очередь к CPU, <code>b</code> — заблокированы на I/O; <code>wa</code> — % CPU в ожидании I/O"],
      ["mpstat -P ALL 1","Загрузка каждого CPU; ищем: один ядро на 100% → однопоточная bottleneck"],
      ["pidstat -d 1","I/O по процессам каждую секунду: kB_rd/s, kB_wr/s — кто пишет/читает"],
      ["iotop -oP","Процессы с активным I/O; <code>-o</code> — только активные, <code>-P</code> — по процессам"],
      ["sar -d 1 5","Статистика I/O по устройствам из sysstat; 5 замеров по 1 секунде"],
      ["sar -n DEV 1","Сетевой трафик по интерфейсам: пакеты, байты, ошибки, дропы"],
      ["dstat","Единый обзор CPU, диск, сеть, память в реальном времени (замена vmstat+iostat)"],
      ["uptime","Load average за 1, 5, 15 минут; сравнить с <code>nproc</code> — если больше → перегрузка"]
    ]
  },
  {
    id:"git", title:"Git", tag:"инструменты",
    note:"fetch загружает данные с remote, но не трогает рабочие файлы; pull = fetch + merge. origin — ваш форк, upstream — оригинальный репозиторий.",
    rows:[
      ["git remote -v","Список remote'ов с URL; проверить, что origin и upstream указывают куда надо"],
      ["git fetch --all --prune","Обновить все remote'ы; <code>--prune</code> — удалить локальные ссылки на удалённые ветки"],
      ["git log main..origin/main --oneline","Коммиты в origin/main, которых нет в локальном main (что прилетит при merge)"],
      ["git log --oneline --graph -20","Последние 20 коммитов с графом веток"],
      ["git push -u origin <b>branch</b>","Отправить ветку и установить upstream-tracking (<code>-u</code>); потом просто <code>git push</code>"],
      ["git stash -u","Спрятать изменения включая untracked (<code>-u</code>); <code>git stash pop</code> — вернуть"],
      ["git diff --cached","Показать staged-изменения (что войдёт в commit)"],
      ["git checkout -b <b>branch</b> origin/<b>branch</b>","Создать локальную ветку из remote и переключиться"],
      ["git reset --soft HEAD~1","Отменить последний коммит, оставив изменения staged; <span class='danger'><code>--hard</code> — потеря изменений</span>"],
      ["git ls-files --eol","Показать конец строки (CRLF/LF) для файлов; <code>--renormalize</code> — пересчитать при смене .gitattributes"],
      ["gh auth login","Авторизация GitHub CLI; <code>gh auth setup-git</code> — настроить git credential helper"],
      ["gh pr create --fill","Создать PR из текущей ветки; <code>--fill</code> — заполнить заголовок из коммитов"]
    ]
  },
  {
    id:"boot", title:"Загрузка Linux", tag:"теория",
    note:"BIOS/UEFI → загрузчик (GRUB) → ядро + initramfs (временная корневая ФС) → switch_root → systemd (PID 1). Для сброса пароля: в GRUB добавить init=/bin/bash, remount rw.",
    rows:[
      ["cat /proc/cmdline","Параметры ядра текущей загрузки (переданные GRUB'ом)"],
      ["update-grub","Пересобрать конфиг GRUB из <code>/etc/default/grub</code> и скриптов в <code>/etc/grub.d/</code>"],
      ["grub-install <b>/dev/sda</b>","Установить загрузчик на диск; после замены диска или восстановления"],
      ["lsinitramfs /boot/initrd.img-$(uname -r)","Содержимое initramfs (драйверы, утилиты для монтирования корня)"],
      ["update-initramfs -u","Пересобрать initramfs для текущего ядра (после добавления драйверов/модулей)"],
      ["systemd-analyze","Общее время загрузки: firmware → loader → kernel → userspace"],
      ["systemd-analyze blame","Время запуска каждого сервиса; находим тормоз загрузки"],
      ["systemd-analyze critical-chain","Цепочка критического пути загрузки (что ждало чего)"],
      ["init=/bin/bash","Параметр ядра в GRUB: загрузка в shell без systemd; <code>mount -o remount,rw /</code> для записи"],
      ["cat /etc/machine-id","Уникальный ID машины; <span class='hl'>перегенерировать перед клонированием ВМ:</span> <code>rm</code> + <code>systemd-machine-id-setup</code>"],
      ["uname -r","Версия текущего ядра"],
      ["lsmod","Загруженные модули ядра; <code>modprobe <b>модуль</b></code> — загрузить, <code>rmmod</code> — выгрузить"]
    ]
  },
  {
    id:"hw", title:"Железо: CPU, память, диски, PCI/USB", tag:"средний",
    note:"Информация из /proc и /sys — виртуальные файлы ядра, не настоящие файлы на диске. dmidecode требует root и читает SMBIOS напрямую из аппаратных таблиц.",
    rows:[
      ["lscpu","Архитектура, модель, ядра, потоки, кэш; <code>Flags</code> — возможности CPU"],
      ["cat /proc/cpuinfo","Детали по каждому логическому CPU; <code>model name</code>, <code>cpu MHz</code>, <code>flags</code>"],
      ["lsmem","Блоки памяти и их состояние (online/offline); для горячего добавления/удаления"],
      ["dmidecode -t memory","DIMM-слоты: размер, тип (DDR4/DDR5), частота, производитель; <span class='hl'>нужен root</span>"],
      ["lsblk -f","Блочные устройства с ФС, UUID и точками монтирования; <code>-d</code> — только диски"],
      ["smartctl -a <b>/dev/sda</b>","SMART-параметры диска: здоровье, температура, ошибки; <code>-H</code> — краткий статус"],
      ["lspci -k","PCI-устройства с драйверами ядра; <code>-nn</code> — с vendor/device ID"],
      ["lsusb","USB-устройства; <code>-v</code> — подробно, <code>-t</code> — дерево"],
      ["sensors","Температура CPU, вентиляторы; пакет <code>lm-sensors</code>, запустить <code>sensors-detect</code> при первом использовании"],
      ["ethtool <b>eth0</b>","Параметры сетевого интерфейса: скорость, дуплекс, автосогласование"],
      ["hdparm -Tt <b>/dev/sda</b>","Тест скорости чтения диска: кэшированное и буферизованное"],
      ["cat /proc/interrupts","Распределение прерываний по CPU; ищем перекос (одно ядро обрабатывает всё)"]
    ]
  },
  {
    id:"virt", title:"Виртуализация", tag:"средний",
    note:"systemd-detect-virt определяет, работаем ли в ВМ или контейнере. Для KVM нужна аппаратная поддержка: флаги vmx (Intel VT-x) или svm (AMD-V) в /proc/cpuinfo.",
    rows:[
      ["systemd-detect-virt","Определить тип виртуализации: <code>kvm</code>, <code>vmware</code>, <code>docker</code>, <code>lxc</code>, <code>none</code>"],
      ["systemd-detect-virt -c","Только контейнер: <code>docker</code>, <code>lxc</code>, <code>podman</code> или <code>none</code>"],
      ["grep -Ec '(vmx|svm)' /proc/cpuinfo","Проверить поддержку VT-x/AMD-V; >0 → аппаратная виртуализация доступна"],
      ["lscpu | grep Virtualization","Показать тип аппаратной виртуализации: <code>VT-x</code> или <code>AMD-V</code>"],
      ["virsh list --all","KVM: список всех ВМ (запущенные и остановленные); нужен <code>libvirt</code>"],
      ["virsh dominfo <b>vm</b>","Информация о ВМ: CPU, память, состояние"],
      ["virsh console <b>vm</b>","Консоль ВМ через serial (выход: <kbd>Ctrl+]</kbd>)"],
      ["cat /sys/class/dmi/id/product_name","Имя продукта из SMBIOS: «KVM», «VMware Virtual Platform», «VirtualBox»"],
      ["virt-what","Альтернативная утилита определения виртуализации (пакет <code>virt-what</code>)"],
      ["qemu-img info <b>disk.qcow2</b>","Информация об образе диска: формат, размер, снимки"]
    ]
  }
];

const KEYWORDS = {
  nav: "навигация файлы каталоги пути path cd ls find namei findmnt symlink link directory",
  perm: "права владельцы permissions chmod chown rwx acl suid sgid sticky umask stat",
  users: "пользователи группы user group useradd usermod getent ldap passwd chage newgrp",
  text: "текст потоки фильтры grep awk sed sort uniq pipe redirect stdout stderr пайп",
  proc: "процессы threads сигналы signals kill ps pgrep htop top zombie nice nohup load average",
  zombie: "зомби сироты zombie orphan ppid wait sigchld undead defunct",
  systemd: "сервисы services systemctl daemon unit timer cgroup journal enable disable restart",
  logs: "логи журнал journalctl dmesg syslog log oom kernel messages",
  disk: "диск место inode df du lsof mount fstab блоки разделы filesystem truncate tune2fs",
  mem: "память oom swap free available cache buffer vmstat pressure cgroup psi sigkill 137 143",
  net: "сеть network socket порт port ss curl ip route ssh dns bind listen tcp udp firewall iptables dig",
  diag: "диагностика strace lsof perf ptrace syscall трассировка ltrace ebpf proc status",
  io: "нагрузка iostat iotop vmstat mpstat pidstat sar dstat io disk await util load",
  git: "git github fetch pull push merge remote origin upstream branch stash diff pr crlf lf",
  boot: "загрузка boot grub uefi bios initramfs ядро kernel systemd init пароль machine-id",
  hw: "железо cpu память диски pci usb lscpu dmidecode lsblk smartctl sensors hardware",
  virt: "виртуализация vm kvm vmware docker lxc container virsh qemu vt-x amd-v svm vmx"
};

const TAGS = ['всё','базовое','средний','диагностика','инструменты','теория'];
let activeTag = 'всё';
let query = '';

function escapeRe(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') }

function highlightText(html, re){
  if(!re) return html;
  let out='', i=0, inTag=false;
  while(i<html.length){
    if(html[i]==='<'){inTag=true;out+=html[i];i++;continue}
    if(html[i]==='>'&&inTag){inTag=false;out+=html[i];i++;continue}
    if(inTag){out+=html[i];i++;continue}
    let rest=html.slice(i);
    let m=rest.match(re);
    if(m&&m.index===0){
      out+='<mark>'+m[0]+'</mark>';
      i+=m[0].length;
    } else {
      out+=html[i];i++;
    }
  }
  return out;
}

function render(){
  const main=document.getElementById('main');
  const tocEl=document.getElementById('toc');
  const counterEl=document.getElementById('counter');
  const re=query?new RegExp(escapeRe(query),'gi'):null;
  let totalAll=0, totalVis=0, sectAll=0, sectVis=0;
  let sectionsHtml='', tocHtml='';

  DATA.forEach(s=>{
    totalAll+=s.rows.length;
    sectAll++;
    const tagMatch=activeTag==='всё'||s.tag===activeTag;
    if(!tagMatch){
      tocHtml+=`<a href="#s-${s.id}" style="display:none">${s.title}</a>`;
      return;
    }
    const kw=KEYWORDS[s.id]||'';
    let visRows=[];
    s.rows.forEach(r=>{
      if(!re){visRows.push(r);return}
      const cmdText=r[0].replace(/<[^>]+>/g,'');
      const descText=r[1].replace(/<[^>]+>/g,'');
      if(re.test(cmdText)||re.test(descText)||re.test(kw)||re.test(s.title)||re.test(s.note)){
        visRows.push(r);
      }
      re.lastIndex=0;
    });
    if(query&&visRows.length===0){
      tocHtml+=`<a href="#s-${s.id}" style="display:none">${s.title}</a>`;
      return;
    }
    totalVis+=visRows.length;
    sectVis++;
    tocHtml+=`<a href="#s-${s.id}">${s.title}</a>`;
    let rowsHtml='';
    visRows.forEach(r=>{
      let cmd=r[0], desc=r[1];
      if(re){
        cmd=highlightText(cmd,re);
        desc=highlightText(desc,re);
      }
      rowsHtml+=`<div class="row-cmd"><div class="cell-cmd">${cmd}</div><div class="cell-desc">${desc}</div></div>`;
    });
    let noteHtml=s.note;
    if(re) noteHtml=highlightText(noteHtml,re);
    sectionsHtml+=`<section class="sect"><h2 class="sect-title" id="s-${s.id}">${s.title} <span class="badge">${s.tag}</span></h2><p class="sect-note">${noteHtml}</p><div class="grid">${rowsHtml}</div></section>`;
  });

  if(sectVis===0){
    main.innerHTML='<div class="empty">Ничего не нашлось…</div>';
  } else {
    main.innerHTML=sectionsHtml;
  }
  tocEl.innerHTML=tocHtml;

  if(!query&&activeTag==='всё'){
    counterEl.textContent=`${totalAll} команд · ${sectAll} разделов`;
  } else {
    counterEl.textContent=totalVis===0?'Ничего не нашлось…':`${totalVis} из ${totalAll} команд · ${sectVis} из ${sectAll} разделов`;
  }
}

function initChips(){
  const wrap=document.getElementById('chips');
  TAGS.forEach(t=>{
    const btn=document.createElement('button');
    btn.className='chip'+(t===activeTag?' on':'');
    btn.textContent=t;
    btn.onclick=()=>{
      activeTag=t;
      wrap.querySelectorAll('.chip').forEach(c=>c.classList.toggle('on',c.textContent===t));
      render();
    };
    wrap.appendChild(btn);
  });
}

function initSearch(){
  const input=document.getElementById('q');
  const clear=document.getElementById('btn-clear');
  input.addEventListener('input',()=>{
    query=input.value.trim();
    clear.classList.toggle('vis',query.length>0);
    render();
  });
  clear.addEventListener('click',()=>{
    input.value='';query='';
    clear.classList.remove('vis');
    render();
    input.focus();
  });
}

function initTheme(){
  const btn=document.getElementById('btn-theme');
  let theme='';
  try{theme=localStorage.getItem('theme')||''}catch(e){}
  if(theme) document.documentElement.setAttribute('data-theme',theme);
  btn.addEventListener('click',()=>{
    const cur=document.documentElement.getAttribute('data-theme');
    const next=cur==='light'?'dark':cur==='dark'?'':'light';
    if(next) document.documentElement.setAttribute('data-theme',next);
    else document.documentElement.removeAttribute('data-theme');
    try{if(next)localStorage.setItem('theme',next);else localStorage.removeItem('theme')}catch(e){}
  });
}

function initKeys(){
  document.addEventListener('keydown',e=>{
    if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&document.activeElement.tagName!=='INPUT'){
      e.preventDefault();document.getElementById('q').focus();
    }
    if(e.key==='Escape'){
      const input=document.getElementById('q');
      input.value='';query='';
      document.getElementById('btn-clear').classList.remove('vis');
      input.blur();
      render();
    }
  });
}

// PWA
function initPWA() {
  let deferredPrompt = null;
  const inStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (!inStandalone) showInstallBar();
  });
  window.addEventListener('appinstalled', () => { deferredPrompt = null; removeBar('pwa-install'); flash('Приложение установлено'); });

  function showInstallBar() {
    pwaBar('pwa-install', 'Установить как приложение?', 'Установить', async () => {
      removeBar('pwa-install');
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice.catch(() => {});
      deferredPrompt = null;
    });
  }

  if (!('serviceWorker' in navigator) || !/^https?:/.test(location.protocol) || !document.querySelector('link[rel=manifest]')) return;

  navigator.serviceWorker.register('sw.js').then((reg) => {
    if (reg.waiting && navigator.serviceWorker.controller) showUpdateBar(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      if (!nw) return;
      nw.addEventListener('statechange', () => {
        if (nw.state === 'installed' && navigator.serviceWorker.controller) showUpdateBar(nw);
      });
    });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) reg.update().catch(() => {}); });
  }).catch(() => {});

  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloaded) return;
    reloaded = true;
    window.location.reload();
  });

  function showUpdateBar(worker) {
    pwaBar('pwa-update', 'Доступно обновление', 'Обновить', () => {
      removeBar('pwa-update');
      worker.postMessage({ type: 'SKIP_WAITING' });
    });
  }
}

function pwaBar(id, text, actionLabel, onAction) {
  removeBar(id);
  const bar = document.createElement('div');
  bar.className = 'pwa-bar';
  bar.id = id;
  bar.innerHTML = `<span class="pwa-text"></span>
    <button type="button" class="pwa-act"></button>
    <button type="button" class="pwa-close" aria-label="Закрыть">×</button>`;
  bar.querySelector('.pwa-text').textContent = text;
  bar.querySelector('.pwa-act').textContent = actionLabel;
  bar.querySelector('.pwa-act').addEventListener('click', onAction);
  bar.querySelector('.pwa-close').addEventListener('click', () => removeBar(id));
  document.body.append(bar);
}
function removeBar(id) { document.getElementById(id)?.remove(); }

function flash(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    el.id = 'toast';
    document.body.append(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2200);
}

initChips();
initSearch();
initTheme();
initKeys();
render();
initPWA();
