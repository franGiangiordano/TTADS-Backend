# Universidad Tecnológica Nacional  (FRRO)
				
 <div align="center"> 
   


&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Tecnicas y tecnologias avanzadas de Desarrollo de software**
&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Trabajo Práctico**
&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Ingeniería en Sistemas de Información**
&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Comisión Nº: 304**


**Profesores**

Adrián Meca <br> Lucas Luna

**Alumnos**
<div style="margin-left: 25px;">
  
 Nombre y Apellido </t> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mail &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Legajo
</div>

1. Martin Lambrecht <martinoscarlambrecht@gmail.com> 47860
1. Franco Giangiordano <frangiangiordano@gmail.com> &nbsp; 46802
1. Gonzalo Turconi <gonzaturconi@gmail.com> &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;46730

<a name="_page2_x72.00_y72.00"></a>**Propuesta**

<div style="margin-left: 30px;">
  <a name="_page2_x72.00_y112.50"></a>Grupo
</div>

<p align="center"> 
  <a name="_page2_x72.00_y172.09"></a>Integrantes<br>
  
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;46802 - Franco Giangiordano 
  <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;46730 - Gonzalo Turconi 
  <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;47860 - Martin Lambrecht  
  
  <a name="_page2_x72.00_y303.65"></a>Repositorios<br>
  [https://github.com/franGiangiordano/TTADS-Frontend.git ](https://github.com/franGiangiordano/TTADS-Frontend.git)<https://github.com/franGiangiordano/TTADS-Backend.git>
  
</p>
<div style="margin-left: 30px;">
      <a name="_page2_x72.00_y437.51"></a>Tema
</div>
<br>


&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;“Sistema de gestión de flotas de logística”

<a name="_page2_x72.00_y533.53"></a>**Descripción**

GFM Logistics es una empresa líder en el sector de la logística y el transporte de mercancías por carretera. Al ser su principal activo los camiones, una flota moderna y diversa que cumple con los más altos estándares de calidad y seguridad, resulta de gran utilidad un sistema de gestión para su flota, que permita automatizar la carga de datos sobre sus vehículos, choferes y viajes, su presentación sin dejar de lado la seguridad de sus datos y accesos.

<a name="_page3_x72.00_y72.00"></a>**Reglas de negocio**

RN1: Sólo hay 3 tipos de usuario (Operativo, Gerente, Administrador).

RN2: El operario solo debe ser capaz de acceder al CRUD de Viajes, Consulta de Batea, Acoplado, Equipo, Chofer y a todos los listado.

RN3: El Gerente debe tener acceso a todas las funcionalidades del sistema excepto las exclusivas de desarrollo.

RN4: El Administrador debe tener acceso total al sistema.

RN5: Un viaje debe tener Fecha de partida, Fecha de llegada, Gastos total (sin reparaciones en caso de haber), Equipo que lo realizó, descripción, locación inicial, locación final, KM recorridos (posibilidad de incorporar api de Google Maps para este cálculo).

RN6: Un equipo se compone de una Batea, un Acoplado y un Chofer en un momento determinado.

RN7: El listado de viajes debe contener los datos del Viaje, Chofer (Legajo, nombre, apellido), Equipo (descripción, patente batea, patente acoplado) y tener la opción de filtro por: Fecha inicio, Fecha fin, Número de Equipo, Legajo de Chofer, Localidad Inicio, Localidad Fin.

RN8: El tipo de acoplado hace referencia a lo que transporta, puede ser: Térmicos, Frigoríficos, Abiertos, Mosquitos.

![](Aspose.Words.505997ea-e615-4f41-90a4-e8fe94ef404e.002.jpeg)

<a name="_page4_x72.00_y526.31"></a>**Alcance Funcional**
<br>

&nbsp;&nbsp;&nbsp;&nbsp;<a name="_page4_x72.00_y576.91"></a>**Alcance Mínimo**
<br>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Para regularidad:



|**Requisitos**|**Detalle**|
| - | - |
|CRUD simple|<p>1. CRUD Batea.</p><p>2. CRUD Acoplado.</p><p>3. CRUD Chofer.</p><p>4. CRUD Usuario.</p>|



|CRUD dependiente|<p>1. CRUD Viaje (Depende de CRUD Equipo).</p><p>2. CRUD Equipo (Depende de CRUD Batea, Acoplado y Chofer).</p>|
| - | :- |
|Listado + detalle|<p>1. Listado de Equipos a la fecha.</p><p>2. Listado de Choferes a la fecha.</p><p>3. Viajes con filtro por equipo, chofer y tiempo.</p>|
|CUU|<p>1. Cargar gastos de un viaje.</p><p>2. Generar planilla con viajes por chofer en el mes.</p>|

<br>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Para aprobación directa:



|**Requisitos**|**Detalle**|
| - | - |
|CRUD simple|1\. CRUD Reparaciones.|
|CRUD dependiente|1\. CRUD Reparaciones (Depende de CRUD Equipo).|
|Servicio de Geolocación|1\. Búsqueda de localidades en un mapa integrado, que calcula además los KM entre localidades.|
|CUU|1\. Generar listado sobre reparaciones por equipo, chofer, batea y/o acoplado con respectivos KM recorridos.|

&nbsp;&nbsp;&nbsp;&nbsp;<a name="_page5_x72.00_y525.77"></a>**Alcance Adicional Voluntario**



|**Requisitos**|**Detalle**|
| - | - |
|Listados|1\. Listado de Reparaciones entre rangos de fecha (Filtró por chofer, por equipo, con los KM hechos).|


